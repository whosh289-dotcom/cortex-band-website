export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // ==========================================
      // INVENTORY / ADMIN API (Real Data via KV)
      // ==========================================
      if (url.pathname === "/api/products") {
        if (request.method === "GET") {
          let products = await env.CART_KV.get("product_catalog", "json") || [];
          if (products.length === 0) {
              products = [
                  { barcode: "123456789", name: "Organic Apple", price: 1.99 },
                  { barcode: "987654321", name: "Almond Milk 1L", price: 3.49 },
                  { barcode: "112233445", name: "Whole Wheat Bread", price: 2.99 }
              ];
              await env.CART_KV.put("product_catalog", JSON.stringify(products));
          }
          return new Response(JSON.stringify(products), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      // ==========================================
      // CART API
      // ==========================================
      if (request.method === "GET" && url.pathname === "/api/cart") {
        const deviceId = url.searchParams.get("deviceId");
        if(!deviceId) return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400, headers: corsHeaders });

        let cartData = await env.CART_KV.get(`active_cart_${deviceId}`, "json") || { items: [] };
        if (Array.isArray(cartData)) cartData = { items: cartData }; // Backwards compatibility

        let total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return new Response(JSON.stringify({ items: cartData.items, total: total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (request.method === "POST" && url.pathname === "/api/cart/add") {
        const body = await request.json();
        const barcode = body.barcode;
        const deviceId = body.deviceId;
        
        if(!deviceId || !barcode) return new Response(JSON.stringify({ error: "Missing payload" }), { status: 400, headers: corsHeaders });

        let cartData = await env.CART_KV.get(`active_cart_${deviceId}`, "json") || { items: [] };
        if (Array.isArray(cartData)) cartData = { items: cartData };

        // Add Product Logic
        let products = await env.CART_KV.get("product_catalog", "json") || [];
        const product = products.find(p => p.barcode === barcode);
        
        if (!product) {
          return new Response(JSON.stringify({ status: "error", error: "Product not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        const existingItemIndex = cartData.items.findIndex(item => item.barcode === barcode);
        if (existingItemIndex > -1) {
          cartData.items[existingItemIndex].quantity += 1;
        } else {
          cartData.items.push({ barcode: barcode, ...product, quantity: 1 });
        }

        await env.CART_KV.put(`active_cart_${deviceId}`, JSON.stringify(cartData));
        let total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return new Response(JSON.stringify({ status: "success", productName: product.name, price: product.price, cartTotal: total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (request.method === "POST" && url.pathname === "/api/cart/create-checkout-session") {
        const body = await request.json();
        const deviceId = body.deviceId;
        if(!deviceId) return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400, headers: corsHeaders });

        let cartData = await env.CART_KV.get(`active_cart_${deviceId}`, "json") || { items: [] };
        if (Array.isArray(cartData)) cartData = { items: cartData };

        if (!cartData.items || cartData.items.length === 0) {
            return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400, headers: corsHeaders });
        }

        if (!env.STRIPE_SECRET_KEY) {
            return new Response(JSON.stringify({ error: "Stripe Secret Key not configured in Cloudflare." }), { status: 500, headers: corsHeaders });
        }

        // Stripe expects form-urlencoded data for its REST API
        const stripeParams = new URLSearchParams();
        stripeParams.append('success_url', `${url.origin}/index.html?success=true`);
        stripeParams.append('cancel_url', `${url.origin}/index.html?canceled=true`);
        stripeParams.append('mode', 'payment');

        cartData.items.forEach((item, index) => {
            stripeParams.append(`line_items[${index}][price_data][currency]`, 'usd');
            stripeParams.append(`line_items[${index}][price_data][product_data][name]`, item.name);
            stripeParams.append(`line_items[${index}][price_data][unit_amount]`, Math.round(item.price * 100)); // Stripe uses cents
            stripeParams.append(`line_items[${index}][quantity]`, item.quantity);
        });

        // Call Stripe API directly
        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stripeParams.toString()
        });

        const session = await stripeRes.json();
        
        if (session.error) {
            return new Response(JSON.stringify({ error: session.error.message }), { status: 400, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (request.method === "POST" && url.pathname === "/api/cart/checkout") {
        const body = await request.json();
        const deviceId = body.deviceId;
        if(!deviceId) return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400, headers: corsHeaders });

        let cartData = await env.CART_KV.get(`active_cart_${deviceId}`, "json") || { items: [] };
        if (Array.isArray(cartData)) cartData = { items: cartData };

        if (cartData.items.length > 0) {
            let history = await env.CART_KV.get(`order_history_${deviceId}`, "json") || [];
            let total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            history.push({ id: Date.now(), date: new Date().toISOString(), items: cartData.items, total: total });
            await env.CART_KV.put(`order_history_${deviceId}`, JSON.stringify(history));
            await env.CART_KV.delete(`active_cart_${deviceId}`);
        }
        return new Response(JSON.stringify({ status: "success" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      
      // ==========================================
      // ORDER HISTORY API
      // ==========================================
      if (request.method === "GET" && url.pathname === "/api/history") {
        const deviceId = url.searchParams.get("deviceId");
        if(!deviceId) return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400, headers: corsHeaders });

        let history = await env.CART_KV.get(`order_history_${deviceId}`, "json") || [];
        history = history.sort((a,b) => b.id - a.id);
        return new Response(JSON.stringify(history), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: corsHeaders });
      
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
