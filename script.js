const products = {
    living: [
        { id: 'l1', name: 'Hand-Woven Jute Rug', price: 120.00, image: 'images/living1.png', sustainability: '100% Biodegradable', score: 9 },
        { id: 'l2', name: 'Organic Cotton Throw', price: 45.00, image: 'images/living2.png', sustainability: 'Fair Trade Certified', score: 8 },
        { id: 'l3', name: 'Bamboo Floor Lamp', price: 89.00, image: 'images/living3.png', sustainability: 'Rapidly Renewable', score: 9 },
        { id: 'l4', name: 'Recycled Wood Side Table', price: 150.00, image: 'images/living4.png', sustainability: 'Reclaimed Timber', score: 10 },
        { id: 'l5', name: 'Seagrass Storage Basket', price: 35.00, image: 'images/living5.png', sustainability: 'Natural Materials', score: 7 },
        { id: 'l6', name: 'Linen Cushion Cover', price: 25.00, image: 'images/living6.png', sustainability: 'Organic Fabric', score: 8 }
    ],
    kitchen: [
        { id: 'k1', name: 'Recycled Glass Pitcher', price: 28.00, image: 'images/kitchen1.png', sustainability: '100% Recycled Glass', score: 9 },
        { id: 'k2', name: 'Bamboo Utensil Set', price: 18.00, image: 'images/kitchen2.png', sustainability: 'Biodegradable', score: 9 },
        { id: 'k3', name: 'Coconut Bowl Set', price: 22.00, image: 'images/kitchen3.png', sustainability: 'Upcycled Waste', score: 10 },
        { id: 'k4', name: 'Organic Cotton Napkins', price: 24.00, image: 'images/kitchen4.png', sustainability: 'GOTS Certified', score: 8 },
        { id: 'k5', name: 'Ceramic Dinner Plate', price: 15.00, image: 'images/kitchen5.png', sustainability: 'Lead-Free Glaze', score: 7 },
        { id: 'k6', name: 'Reusable Beeswax Wraps', price: 12.00, image: 'images/kitchen6.png', sustainability: 'Zero Waste', score: 10 }
    ],
    wellness: [
        { id: 'w1', name: 'Organic Lavender Oil', price: 20.00, image: 'images/wellness1.png', sustainability: 'USDA Organic', score: 9 },
        { id: 'w2', name: 'Soy Wax Candle', price: 18.00, image: 'images/wellness2.png', sustainability: 'Clean Burning', score: 8 },
        { id: 'w3', name: 'Natural Loofah Sponge', price: 8.00, image: 'images/wellness3.png', sustainability: 'Compostable', score: 10 },
        { id: 'w4', name: 'Bamboo Toothbrush', price: 5.00, image: 'images/wellness4.png', sustainability: 'Plastic Free', score: 9 },
        { id: 'w5', name: 'Hemp Bath Towel', price: 45.00, image: 'images/wellness5.png', sustainability: 'Low Water Usage', score: 9 },
        { id: 'w6', name: 'Cork Yoga Mat', price: 60.00, image: 'images/wellness6.png', sustainability: 'Renewable Resource', score: 10 }
    ]
};

// --- Cart Logic ---

function getCart() {
    const cart = localStorage.getItem('terraCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('terraCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id, name, price, image) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart(cart);
    showToast(`Added ${name} to cart!`);
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart(); // Re-render if on cart page
}

function updateQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }
    saveCart(cart);
    renderCart();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

function renderCart() {
    const cartTableBody = document.querySelector('#cart-table-body');
    const cartTotalElement = document.querySelector('#cart-total');

    if (!cartTableBody) return;

    const cart = getCart();
    cartTableBody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty.</td></tr>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; vertical-align: middle; margin-right: 10px;"> ${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    ${item.quantity}
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><button onclick="removeFromCart('${item.id}')" style="color: red; border: none; background: none; cursor: pointer; font-size: 1.2rem;">&times;</button></td>
            `;
            cartTableBody.appendChild(row);
        });
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = 'toast show';
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
}

// --- Product Rendering ---

function loadProducts(category) {
    const container = document.getElementById('product-container');
    if (!container) return;

    const categoryProducts = products[category];
    if (!categoryProducts) return;

    container.innerHTML = '';
    categoryProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        let ecoBadge = '';
        if (product.score > 8) {
            ecoBadge = '<span class="eco-badge">Eco-Choice</span>';
        }

        // Escape arguments for addToCart to handle potential quotes in names (though our data is safe)
        const safeName = product.name.replace(/'/g, "\\'");
        const safeImage = product.image.replace(/'/g, "\\'");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <div class="card-price">$${product.price.toFixed(2)}</div>
                <div class="sustainability-score">
                    <span>Score: ${product.score}/10</span>
                    ${ecoBadge}
                </div>
                <p style="font-size: 0.8rem; color: #666; margin-bottom: 1rem;">${product.sustainability}</p>
                <button class="btn-add-cart" onclick="addToCart('${product.id}', '${safeName}', ${product.price}, '${safeImage}')">Add to Cart</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- User Auth ---

function login(username, password) {
    if (username.length > 3 && password.length > 6) {
        const user = { username, isLoggedIn: true };
        localStorage.setItem('terraUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function signup(username, email, password) {
    if (username.length > 3 && password.length > 6 && email.includes('@')) {
         const user = { username, email, isLoggedIn: true };
         localStorage.setItem('terraUser', JSON.stringify(user));
         return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('terraUser');
    window.location.reload();
}

function checkLogin() {
    const userStr = localStorage.getItem('terraUser');
    const navAuth = document.getElementById('nav-auth');
    if (navAuth) {
        if (userStr) {
            const user = JSON.parse(userStr);
             navAuth.innerHTML = `<a href="#" onclick="logout()">Logout (${user.username})</a>`;
        } else {
             navAuth.innerHTML = `<a href="login.html">Login</a>`;
        }
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkLogin();

    // Check if we are on a category page
    const path = window.location.pathname;
    if (path.includes('living')) loadProducts('living');
    if (path.includes('kitchen')) loadProducts('kitchen');
    if (path.includes('wellness')) loadProducts('wellness');

    if (path.includes('cart')) renderCart();
});
