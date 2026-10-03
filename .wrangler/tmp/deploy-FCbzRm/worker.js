// worker.js
var indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Cortex Band - The Next Generation Smart Retail POS">
    <meta name="keywords" content="POS, Retail, Enterprise, Band, Cortex, Smart Retail">
    <title>Cortex Band - Checkout</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { display: none; }
      @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
  .floating { animation: float 6s ease-in-out infinite; }
  .glass-panel { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5); }
</style>
</head>
<body class="bg-[radial-gradient(circle_at_top_right,_#001f3f,_#07080d_50%,_#000000)] min-h-screen text-slate-50 antialiased flex flex-col md:flex-row relative selection:bg-cyan-900/30 selection:text-white">

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 p-6 sticky top-0 h-screen shrink-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
        <h1 class="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-10">Cortex Platform</h1>
        <nav class="space-y-2 flex-grow">
            <a href="index.html" class="flex items-center gap-3 text-cyan-400 font-semibold bg-cyan-900/30 px-4 py-3 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Cart
            </a>
            <a href="history.html" class="flex items-center gap-3 text-slate-400 hover:bg-slate-900 hover:text-cyan-400 font-medium px-4 py-3 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Receipts
            </a>
        </nav>
        <button onclick="document.getElementById('pair-modal').classList.remove('hidden')" class="w-full bg-slate-800 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors shadow-inner">
            Pair Device
        </button>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex justify-between items-center sticky top-0 z-40 border-b border-slate-800 shadow-sm">
        <h1 class="text-xl font-bold tracking-tight text-slate-50">Cortex Cart</h1>
        <button onclick="document.getElementById('pair-modal').classList.remove('hidden')" class="text-sm font-semibold text-cyan-400 bg-cyan-900/30 px-4 py-2 rounded-full">Pair</button>
    </div>

    <!-- Main Content -->
    <main class="flex-grow p-6 md:p-10 pb-48 md:pb-10 w-full max-w-7xl">
        <div class="flex justify-between items-end mb-8">
            <h2 class="text-2xl md:text-3xl font-bold text-slate-200">Your Cart</h2>
            <span id="item-count" class="text-sm font-medium text-slate-400 bg-slate-950 px-4 py-1.5 rounded-full shadow-sm border border-slate-800">0 Items</span>
        </div>
        
        <div id="cart-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <div class="col-span-full text-center text-slate-400 py-20 text-sm font-medium glass-panel rounded-3xl border-2 border-dashed border-white/10 shadow-sm">
                Your cart is currently empty.<br>Please pair your Cortex Band to begin scanning items.
            </div>
        </div>

        <!-- FOOTER -->
        <footer class="mt-12 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <div class="flex space-x-4 mt-4 md:mt-0">
                <a href="#" class="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Terms of Service</a>
                <a href="#" class="hover:text-cyan-400 transition-colors">Support</a>
            </div>
        </footer>
    </main>

    <!-- Checkout Sidebar (Desktop) / Footer (Mobile) -->
    <aside class="fixed md:sticky bottom-16 md:bottom-0 md:top-0 w-full md:w-80 lg:w-96 glass-panel md:border-l border-t border-white/5 p-6 z-40 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-none md:h-screen flex flex-col justify-end md:justify-start shrink-0 rounded-t-3xl md:rounded-none">
        <div class="md:mt-10 w-full">
            <h3 class="hidden md:block text-xl font-bold text-slate-50 mb-8 border-b border-slate-800 pb-4">Order Summary</h3>
            <div class="flex justify-between items-end mb-6 px-2 md:px-0">
                <span class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                <span id="cart-total" class="text-3xl font-black tracking-tight text-slate-50">$0.00</span>
            </div>
            <button id="checkout-btn" class="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 rounded-2xl transition-all shadow-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] flex justify-center items-center gap-2 text-lg active:scale-[0.98]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> 
                Secure Checkout
            </button>
        </div>
    </aside>

    <!-- Mobile Bottom Nav -->
    <div class="md:hidden fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around p-1 text-xs font-medium text-slate-400 z-50 shadow-2xl">
        <a href="index.html" class="flex flex-col items-center text-cyan-400 w-1/2 py-3 transition-colors">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Cart
        </a>
        <a href="history.html" class="flex flex-col items-center hover:text-cyan-400 w-1/2 py-3 transition-colors">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Receipts
        </a>
    </div>

    <!-- Pairing Modal -->
    <div id="pair-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity">
        <div class="bg-slate-950 p-8 max-w-md w-full shadow-2xl rounded-3xl relative">
            <div class="text-center mb-5">
                <div class="mx-auto bg-cyan-900/50 text-cyan-400 w-14 h-14 flex items-center justify-center rounded-full mb-3 shadow-inner">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-slate-50 tracking-tight">Pair Your Band</h3>
            </div>

            <div class="bg-cyan-900/30/50 border border-cyan-800 rounded-2xl p-5 mb-6 text-left shadow-sm">
                <h4 class="text-xs font-bold tracking-widest text-cyan-200 uppercase mb-3">First Time Setup?</h4>
                <ol class="text-sm text-slate-400 space-y-2 pl-4 list-decimal font-medium">
                    <li>Power on your Cortex Band.</li>
                    <li>Open phone Wi-Fi, connect to <strong class="text-slate-50 font-bold">Cortex-Band-Setup</strong>.</li>
                    <li>Follow popup to connect band to local Wi-Fi.</li>
                </ol>
            </div>
            
            <p class="text-sm text-slate-400 mb-2 font-semibold text-center uppercase tracking-wider">Enter 6-Digit Device ID:</p>
            <input type="text" id="pair-code-input" placeholder="A1B2C3" maxlength="6" class="w-full text-center text-4xl tracking-[0.25em] font-mono border-2 border-slate-800 bg-slate-900 rounded-2xl p-5 mb-6 outline-none focus:border-indigo-600 focus:bg-slate-950 focus:ring-4 focus:ring-cyan-500/10 transition-all uppercase text-slate-50 font-bold shadow-inner">
            
            <div class="flex gap-4 w-full">
                <button onclick="document.getElementById('pair-modal').classList.add('hidden')" class="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-colors border border-slate-800">
                    Cancel
                </button>
                <button onclick="pairBand()" class="w-1/2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    Connect
                </button>
            </div>
        </div>
    </div>

    <!-- COOKIE CONSENT BANNER -->
    <div id="cookie-banner" class="fixed bottom-24 md:bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl glass-panel rounded-full px-6 py-4 flex flex-col md:flex-row items-center justify-between z-[100] shadow-2xl">
        <p class="text-sm text-slate-300 mb-4 md:mb-0 text-center md:text-left">
            We use enterprise-grade cookies to ensure the best experience on our platform. By continuing, you agree to our <a href="#" class="text-cyan-400 hover:underline">Privacy Policy</a>.
        </p>
        <button onclick="document.getElementById('cookie-banner').style.display='none'" class="whitespace-nowrap px-6 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 transition shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            Accept & Continue
        </button>
    </div>

    <script>
        const API_URL = 'https://cortex-saas-platform.pages.dev/api';
        
        async function fetchCart() {
            const currentDeviceId = localStorage.getItem('cortex_device_id');
            if(!currentDeviceId) {
                document.getElementById('pair-modal').classList.remove('hidden');
                return;
            }
            try {
                const res = await fetch(API_URL + '/cart?deviceId=' + currentDeviceId);
                if(!res.ok) throw new Error("API Error");
                const data = await res.json();
                
                const list = document.getElementById('cart-list');
                const totalEl = document.getElementById('cart-total');
                const countEl = document.getElementById('item-count');
                
                if(!data.items || data.items.length === 0) {
                    list.innerHTML = '<div class="col-span-full text-center text-slate-400 py-20 text-sm font-medium glass-panel rounded-3xl border-2 border-dashed border-white/10 shadow-sm">Your cart is currently empty.<br>Please pair your Cortex Band to begin scanning items.</div>';
                    totalEl.innerText = "$0.00";
                    countEl.innerText = "0 Items";
                    document.getElementById('checkout-btn').disabled = true;
                    document.getElementById('checkout-btn').classList.add('opacity-50', 'cursor-not-allowed');
                    return;
                }
                
                document.getElementById('checkout-btn').disabled = false;
                document.getElementById('checkout-btn').classList.remove('opacity-50', 'cursor-not-allowed');

                let totalCount = 0;
                list.innerHTML = data.items.map(item => {
                    totalCount += item.quantity;
                    return \`
                    <div class="flex justify-between items-center glass-panel hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 floating p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-900/300"></div>
                        <div class="flex items-center gap-4 pl-2">
                            <div class="bg-cyan-900/30 text-cyan-300 font-bold px-3 py-1.5 text-sm rounded-lg border border-cyan-800">
                                \${item.quantity}
                            </div>
                            <span class="font-bold text-slate-200 text-lg">\${item.name}</span>
                        </div>
                        <span class="font-black text-slate-50 text-xl">$\${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    \`;
                }).join('');
                
                totalEl.innerText = \`$\${data.total.toFixed(2)}\`;
                countEl.innerText = \`\${totalCount} Item\${totalCount !== 1 ? 's' : ''}\`;
                
            } catch (err) {
                console.error(err);
            }
        }
        
        setInterval(() => {
            if(localStorage.getItem('cortex_device_id') && document.getElementById('pair-modal').classList.contains('hidden')) {
                fetchCart();
            }
        }, 2000);
        
        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.get('success') && !urlParams.get('canceled')) fetchCart();

            if(urlParams.get('success') === 'true') {
                const btn = document.getElementById('checkout-btn');
                btn.innerText = "Payment Successful";
                btn.classList.replace('bg-cyan-500', 'bg-emerald-500');
                btn.classList.replace('hover:bg-cyan-600', 'hover:bg-emerald-600');
                btn.classList.replace('shadow-[0_0_20px_rgba(6,182,212,0.5)]', 'shadow-emerald-500/30');
                window.history.replaceState({}, document.title, window.location.pathname);
                
                const deviceId = localStorage.getItem('cortex_device_id');
                if (deviceId) {
                    fetch(API_URL + '/cart/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ deviceId })
                    }).then(() => {
                        setTimeout(() => {
                            btn.innerHTML = \`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Checkout\`;
                            btn.classList.replace('bg-emerald-500', 'bg-cyan-500');
                            btn.classList.replace('hover:bg-emerald-600', 'hover:bg-cyan-600');
                            btn.classList.replace('shadow-emerald-500/30', 'shadow-[0_0_20px_rgba(6,182,212,0.5)]');
                            fetchCart();
                        }, 2500);
                    });
                }
            }
            if(urlParams.get('canceled') === 'true') window.history.replaceState({}, document.title, window.location.pathname);
        });
        
        async function pairBand() {
            const codeInput = document.getElementById('pair-code-input');
            const code = codeInput.value.trim().toUpperCase();
            if (code.length < 6) return alert('Please enter the 6-character code.');
            const btn = document.querySelector('#pair-modal button[onclick*="pairBand()"]');
            // Disable button to prevent double submissions
            if (btn) btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/band/pair', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deviceId: code })
                });
                if (res.ok) {
                    localStorage.setItem('cortex_device_id', code);
                    localStorage.setItem('cortex_logged_in', 'true');
                    codeInput.value = '';
                    fetchCart();
                } else {
                    // Try to extract server-provided error message
                    let errMsg = 'Error pairing device with server.';
                    try { const data = await res.json(); if (data.error) errMsg = data.error; } catch (_) {}
                    alert(errMsg);
                }
            } catch (e) {
                alert('Network error.');
            }
            if (btn) btn.disabled = false;
        }

        document.getElementById('checkout-btn').addEventListener('click', async () => {
            const currentDeviceId = localStorage.getItem('cortex_device_id');
            if(!currentDeviceId) return;
            const btn = document.getElementById('checkout-btn');
            btn.innerText = "Processing...";
            btn.disabled = true;
            try {
                const res = await fetch(API_URL + '/cart/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ deviceId: currentDeviceId })
                });
                const data = await res.json();
                if(data.url) window.location.href = data.url;
                else throw new Error(data.error || "Failed to create session");
            } catch(e) {
                alert(e.message);
                btn.innerHTML = \`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Checkout\`;
                btn.disabled = false;
            }
        });
    <\/script>
</body>
</html>
<!-- Trigger redeploy -->
`;
var historyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Cortex Band - The Next Generation Smart Retail POS">
    <meta name="keywords" content="POS, Retail, Enterprise, Band, Cortex, Smart Retail">
    <title>Cortex Band - Receipts</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { display: none; }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-50 to-slate-200 min-h-screen text-slate-900 antialiased flex flex-col md:flex-row relative selection:bg-indigo-500 selection:text-white">

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 p-6 sticky top-0 h-screen shrink-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
        <h1 class="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-10">Cortex Platform</h1>
        <nav class="space-y-2 flex-grow">
            <a href="index.html" class="flex items-center gap-3 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-medium px-4 py-3 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Cart
            </a>
            <a href="history.html" class="flex items-center gap-3 text-indigo-600 font-semibold bg-indigo-50 px-4 py-3 rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Receipts
            </a>
        </nav>
    </aside>

    <!-- Mobile Header -->
    <div class="md:hidden bg-white/80 backdrop-blur-md px-6 py-5 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <h1 class="text-xl font-bold tracking-tight text-slate-900">Order History</h1>
    </div>

    <!-- Main Content -->
    <main class="flex-grow p-6 md:p-10 pb-32 md:pb-10 w-full max-w-7xl mx-auto">
        <div class="hidden md:flex justify-between items-end mb-8">
            <h2 class="text-3xl font-bold text-slate-800">Your Receipts</h2>
        </div>
        
        <div id="receipt-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="col-span-full text-center text-slate-400 py-20 text-sm font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                Retrieving transaction history...
            </div>
        </div>

        <!-- FOOTER -->
        <footer class="mt-12 py-8 bg-slate-900 text-slate-400 rounded-2xl flex flex-col md:flex-row justify-between items-center text-xs px-8 shadow-xl">
            <div class="flex space-x-4 mt-4 md:mt-0">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" class="hover:text-white transition-colors">Support</a>
            </div>
        </footer>
    </main>

    <!-- Mobile Bottom Nav -->
    <div class="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around p-1 text-xs font-medium text-slate-400 z-50 shadow-2xl">
        <a href="index.html" class="flex flex-col items-center hover:text-indigo-600 w-1/2 py-3 transition-colors">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Cart
        </a>
        <a href="history.html" class="flex flex-col items-center text-indigo-600 w-1/2 py-3 transition-colors">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Receipts
        </a>
    </div>
    
    <!-- COOKIE CONSENT BANNER -->
    <div id="cookie-banner" class="fixed bottom-24 md:bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex flex-col md:flex-row items-center justify-between z-[100] shadow-2xl">
        <p class="text-sm text-slate-100 mb-4 md:mb-0 text-center md:text-left">
            We use enterprise-grade cookies to ensure the best experience on our platform. By continuing, you agree to our <a href="#" class="text-indigo-400 hover:underline">Privacy Policy</a>.
        </p>
        <button onclick="document.getElementById('cookie-banner').style.display='none'" class="whitespace-nowrap px-6 py-2 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            Accept & Continue
        </button>
    </div>

    <script>
        const API_URL = 'https://cortex-saas-platform.pages.dev/api';
        
        async function loadHistory() {
            const currentDeviceId = localStorage.getItem('cortex_device_id');
            if(!currentDeviceId) {
                document.getElementById('receipt-list').innerHTML = '<div class="col-span-full text-center text-slate-400 py-20 text-sm font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">Please authenticate your Cortex Band to view transaction history.</div>';
                return;
            }
            try {
                const res = await fetch(API_URL + '/history?deviceId=' + currentDeviceId);
                if(!res.ok) throw new Error("API Error");
                const history = await res.json();
                
                const list = document.getElementById('receipt-list');
                
                if(!history || history.length === 0) {
                    list.innerHTML = '<div class="col-span-full text-center text-slate-400 py-20 text-sm font-medium bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">No transaction history available.</div>';
                    return;
                }
                
                list.innerHTML = history.map(order => {
                    const dateObj = new Date(order.date);
                    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    const itemsHtml = order.items.map(i => \`
                        <li class="flex justify-between py-2.5 text-sm border-b border-slate-50 last:border-0">
                            <span class="text-slate-700 font-medium"><span class="text-slate-400 mr-2 text-xs">\${i.quantity}x</span>\${i.name}</span> 
                            <span class="text-slate-900 font-semibold">$\${(i.price * i.quantity).toFixed(2)}</span>
                        </li>
                    \`).join('');

                    return \`
                    <div class="bg-white border border-slate-200 rounded-3xl shadow-sm p-7 relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-fit">
                        <div class="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500"></div>
                        <div class="flex justify-between items-center mb-6 mt-2">
                            <div class="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest">
                                ORD #\${order.id.toString().padStart(4, '0')}
                            </div>
                            <span class="text-xs text-slate-400 font-semibold">\${dateStr}</span>
                        </div>
                        <ul class="mb-6 space-y-1">
                            \${itemsHtml}
                        </ul>
                        <div class="flex justify-between items-center border-t border-slate-100 pt-5 bg-slate-50/50 -mx-7 -mb-7 px-7 pb-7">
                            <span class="text-sm font-semibold text-slate-500">Total Paid</span>
                            <span class="font-bold text-2xl text-slate-900">$\${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    \`;
                }).join('');
                
            } catch (err) {
                console.error(err);
                document.getElementById('receipt-list').innerHTML = '<div class="col-span-full text-red-500 text-center py-4 w-full text-sm font-medium">Error loading receipts.</div>';
            }
        }
        
        loadHistory();
    <\/script>
</body>
</html>
`;
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/history" || url.pathname === "/history.html") {
      return new Response(historyHtml, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    return new Response(indexHtml, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
