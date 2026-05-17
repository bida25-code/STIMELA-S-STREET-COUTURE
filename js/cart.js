// js/cart.js - Stimela's Street Couture Shopping Cart

let cart = JSON.parse(localStorage.getItem('stimelaCart')) || [];

function saveCart() {
    localStorage.setItem('stimelaCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
    });
}

// Unique Unsplash images for each product
const productImages = {
    'voyager-hoodie': 'images/vogaerHoodie.jpg',
    'utility-cargos': 'images/tacticalCargos.jpg',
    'reconstructed-denim': 'images/reconstrutedDenim.webp',
    'utility-zipup': 'images/utilityzipUp.webp',
    'satin-bomber': 'images/satinBomber.webp',
    'essential-sweats': 'images/cagorPants.jfif',
    'crystal-tee': 'images/crystal-tee.jpg',
    'paneled-joggers': 'images/paneled-joggers.jpg',
    'midnight-pullover': 'images/midnight-pullover.jpg',
    'campus-hoodie': 'images/campus-hoodie.jpg',
    'district-cargos': 'images/district-cargos.jpg',
    'safari-shirt': 'images/safari-shirt.jpg',
    'vintage-tee': 'images/vintage-tee.jpg',
    'puffer-vest': 'images/puffer-vest.jpg',
    'trench-coat': 'images/trench-coat.jpg',
    'crossbody-bag': 'images/crossbody-bag.jpg',
    'knit-beanie': 'images/knit-beanie.jpg',
    'chain-necklace': 'images/chain-necklace.jpg'
};

// Also map from the URL pattern for index/collection pages that might pass full URLs
function getImage(productId, providedUrl) {
    if (providedUrl && providedUrl.startsWith('http')) return providedUrl;
    return productImages[productId] || 'images/logo.png';
}

function addToCart(productId, name, price, size, image) {
    const s = size || 'M';
    const existing = cart.find(i => i.id === productId && i.size === s);
    if (existing) { existing.quantity++; }
    else { cart.push({ id: productId, name, price: parseFloat(price), size: s, quantity: 1, image: image || '' }); }
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(productId, size) {
    const item = cart.find(i => i.id === productId && i.size === size);
    cart = cart.filter(i => !(i.id === productId && i.size === size));
    saveCart(); renderCartPage();
    showNotification(`${item ? item.name : 'Item'} removed`, 'info');
}

function updateQuantity(productId, size, qty) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item) return;
    if (qty <= 0) { removeFromCart(productId, size); return; }
    item.quantity = qty; saveCart(); renderCartPage();
}

function getCartTotal() { return cart.reduce((t, i) => t + (i.price * i.quantity), 0); }

function clearCart() {
    if (!cart.length) return;
    cart = []; saveCart(); renderCartPage();
    showNotification('Cart cleared', 'info');
}

function checkout() {
    if (!cart.length) { showNotification('Your cart is empty!', 'error'); return; }
    const orderNumber = 'SSC-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const orders = JSON.parse(localStorage.getItem('stimelaOrders')) || [];
    orders.unshift({ orderNumber, date: new Date().toLocaleString(), items: [...cart], total: getCartTotal(), status: 'Confirmed' });
    localStorage.setItem('stimelaOrders', JSON.stringify(orders));
    cart = []; saveCart();
    showNotification(`ORDER PLACED! #${orderNumber}`, 'success', 5000);
    setTimeout(() => window.location.href = 'tracking.html?order=' + orderNumber, 2000);
}

function showNotification(msg, type = 'success', dur = 3000) {
    const old = document.querySelector('.cart-notification');
    if (old) old.remove();
    const n = document.createElement('div');
    n.className = `cart-notification ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    n.innerHTML = `<div class="notification-content"><i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span></div>`;
    document.body.appendChild(n);
    setTimeout(() => { n.classList.add('fade-out'); setTimeout(() => n.remove(), 300); }, dur);
}

function renderCartPage() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    const emptyEl = document.getElementById('emptyCartMessage');
    const finalEl = document.getElementById('cartTotalFinal');
    if (!container) return;

    if (!cart.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        container.innerHTML = '';
        if (totalEl) totalEl.textContent = 'P0.00';
        if (finalEl) finalEl.textContent = 'P0.00';
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    container.innerHTML = cart.map((item, idx) => {
        const src = getImage(item.id, item.image);
        return `<div class="cart-item mb-2 p-3" data-id="${item.id}" data-size="${item.size}">
            <div class="row align-items-center g-2">
                <div class="col-md-2 col-4">
                    <img src="${src}" alt="${item.name}" class="cart-item-img img-fluid rounded" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="cart-item-img bg-dark rounded d-none align-items-center justify-content-center"><i class="fas fa-tshirt fa-2x text-muted-custom"></i></div>
                </div>
                <div class="col-md-4 col-8">
                    <h6 class="fw-bold mb-1">${item.name}</h6>
                    <p class="small text-muted-custom mb-0">Size: ${item.size}</p>
                </div>
                <div class="col-md-2 col-4 mt-2 mt-md-0">
                    <p class="mb-0 fw-bold text-gold">P${item.price}</p>
                </div>
                <div class="col-md-2 col-4">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary minus-qty" data-idx="${idx}" type="button">−</button>
                        <input type="number" class="form-control text-center qty-input" data-idx="${idx}" value="${item.quantity}" min="1" style="max-width:55px">
                        <button class="btn btn-outline-secondary plus-qty" data-idx="${idx}" type="button">+</button>
                    </div>
                </div>
                <div class="col-md-2 col-4 text-end">
                    <p class="fw-bold mb-0 text-gold">P${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-link text-danger btn-sm remove-item p-0" data-idx="${idx}" style="color:#ff6b6b !important;">Remove</button>
                </div>
            </div>
        </div>`;
    }).join('');

    const sub = getCartTotal();
    if (totalEl) totalEl.textContent = `P${sub.toFixed(2)}`;
    if (finalEl) finalEl.textContent = `P${(sub + (sub > 0 ? 50 : 0)).toFixed(2)}`;

    document.querySelectorAll('.minus-qty').forEach(b => b.addEventListener('click', () => { const i = cart[parseInt(b.dataset.idx)]; if (i) updateQuantity(i.id, i.size, i.quantity - 1); }));
    document.querySelectorAll('.plus-qty').forEach(b => b.addEventListener('click', () => { const i = cart[parseInt(b.dataset.idx)]; if (i) updateQuantity(i.id, i.size, i.quantity + 1); }));
    document.querySelectorAll('.qty-input').forEach(inp => inp.addEventListener('change', () => { const i = cart[parseInt(inp.dataset.idx)]; const q = parseInt(inp.value); if (i && !isNaN(q) && q > 0) updateQuantity(i.id, i.size, q); else if (q <= 0) removeFromCart(i.id, i.size); }));
    document.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', () => { const i = cart[parseInt(b.dataset.idx)]; if (i) removeFromCart(i.id, i.size); }));
}

function initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(b => { b.removeEventListener('click', handleAdd); b.addEventListener('click', handleAdd); });
    document.querySelectorAll('.add-to-cart-btn').forEach(b => { b.removeEventListener('click', handleAddBtn); b.addEventListener('click', handleAddBtn); });
}

function handleAdd(e) {
    const b = e.currentTarget;
    addToCart(b.dataset.id, b.dataset.name, b.dataset.price, b.dataset.size || 'M', b.dataset.image);
}

function handleAddBtn(e) {
    const b = e.currentTarget;
    const sel = b.closest('.card')?.querySelector('.product-size');
    addToCart(b.dataset.id, b.dataset.name, b.dataset.price, sel ? sel.value : 'M', b.dataset.image);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initAddToCartButtons();
    const obs = new MutationObserver(() => initAddToCartButtons());
    obs.observe(document.body, { childList: true, subtree: true });
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
        document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
        document.getElementById('clearCartBtn')?.addEventListener('click', () => { if (confirm('Clear cart?')) clearCart(); });
    }
});
