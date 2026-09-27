export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // CORS headers just in case it's hit externally, though Pages proxies it perfectly
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // ==========================================
    // INVENTORY / ADMIN API (Real Data via KV)
    // ==========================================
    if (url.pathname === "/api/products") {
      if (request.method === "GET") {
        let products = await env.CART_KV.get("product_catalog", "json") || [];
        // Hardcode a default catalog if empty for the prototype
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
      
      if (request.method === "POST") {
        const body = await request.json();
        let products = await env.CART_KV.get("product_catalog", "json") || [];
        products = products.filter(p => p.barcode !== body.barcode);
        products.push({ barcode: body.barcode, name: body.name, price: parseFloat(body.price) });
        await env.CART_KV.put("product_catalog", JSON.stringify(products));
        return new Response(JSON.stringify({ status: "success" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      
      if (request.method === "DELETE") {
        const body = await request.json();
        let products = await env.CART_KV.get("product_catalog", "json") || [];
        products = products.filter(p => p.barcode !== body.barcode);
        await env.CART_KV.put("product_catalog", JSON.stringify(products));
        return new Response(JSON.stringify({ status: "success" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ==========================================
    // CART API
    // ==========================================
    if (request.method === "GET" && url.pathname === "/api/cart") {
      let cart = await env.CART_KV.get("active_cart", "json") || [];
      let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return new Response(JSON.stringify({ items: cart, total: total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (request.method === "POST" && url.pathname === "/api/cart/add") {
      const body = await request.json();
      const barcode = body.barcode;

      let products = await env.CART_KV.get("product_catalog", "json") || [];
      const product = products.find(p => p.barcode === barcode);
      
      if (!product) {
        return new Response(JSON.stringify({ status: "error", error: "Product not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      let cart = await env.CART_KV.get("active_cart", "json") || [];
      const existingItemIndex = cart.findIndex(item => item.barcode === barcode);
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ barcode: barcode, ...product, quantity: 1 });
      }

      await env.CART_KV.put("active_cart", JSON.stringify(cart));
      let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return new Response(JSON.stringify({ status: "success", productName: product.name, price: product.price, cartTotal: total }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (request.method === "POST" && url.pathname === "/api/cart/checkout") {
      let cart = await env.CART_KV.get("active_cart", "json") || [];
      if (cart.length > 0) {
          let history = await env.CART_KV.get("order_history", "json") || [];
          let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          history.push({ id: Date.now(), date: new Date().toISOString(), items: cart, total: total });
          await env.CART_KV.put("order_history", JSON.stringify(history));
          await env.CART_KV.delete("active_cart");
      }
      return new Response(JSON.stringify({ status: "success" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    // ==========================================
    // ORDER HISTORY API
    // ==========================================
    if (request.method === "GET" && url.pathname === "/api/history") {
      let history = await env.CART_KV.get("order_history", "json") || [];
      history = history.sort((a,b) => b.id - a.id);
      return new Response(JSON.stringify(history), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
}
