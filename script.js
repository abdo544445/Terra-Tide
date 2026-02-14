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

// --- Wishlist Logic ---

function getWishlist() {
    return JSON.parse(localStorage.getItem('terraWishlist') || '[]');
}

function toggleWishlist(id, name, price, image) {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === id);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
    } else {
        wishlist.push({ id, name, price, image });
        showToast('Added to wishlist');
    }

    localStorage.setItem('terraWishlist', JSON.stringify(wishlist));

    // Update button style if we are on a page with products
    const btn = document.getElementById(`wish-${id}`);
    if (btn) {
        btn.classList.toggle('active');
        btn.innerHTML = index > -1 ? '&#9825;' : '&#10084;'; // Toggle heart
    }
}


// --- Product Rendering & Filtering ---

let currentCategoryProducts = [];

function loadProducts(category) {
    const container = document.getElementById('product-container');
    if (!container) return;

    currentCategoryProducts = products[category];
    if (!currentCategoryProducts) return;

    renderProductGrid(currentCategoryProducts);
}

function renderProductGrid(productsToRender) {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = '';
    const wishlist = getWishlist();

    if (productsToRender.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No products found.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';

        let ecoBadge = '';
        if (product.score > 8) {
            ecoBadge = '<span class="eco-badge">Eco-Choice</span>';
        }

        const safeName = product.name.replace(/'/g, "\\'");
        const safeImage = product.image.replace(/'/g, "\\'");

        const isWishlisted = wishlist.some(item => item.id === product.id);
        const heartIcon = isWishlisted ? '&#10084;' : '&#9825;'; // Filled or empty heart
        const activeClass = isWishlisted ? 'active' : '';

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <button id="wish-${product.id}" class="wishlist-btn ${activeClass}" onclick="toggleWishlist('${product.id}', '${safeName}', ${product.price}, '${safeImage}')">${heartIcon}</button>
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

function filterProducts() {
    const sortValue = document.getElementById('sort-select').value;
    const filterValue = document.getElementById('filter-select').value;

    let filtered = [...currentCategoryProducts];

    // Filter by Eco-Score
    if (filterValue === 'eco') {
        filtered = filtered.filter(p => p.score >= 9);
    }

    // Sort
    if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProductGrid(filtered);
}


// --- Search Logic ---
function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.toLowerCase();
            if (!query) return;

            // Flatten all products
            const allProducts = [
                ...products.living,
                ...products.kitchen,
                ...products.wellness
            ];

            const results = allProducts.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.sustainability.toLowerCase().includes(query)
            );

            // Store results in localStorage to pass to a results page,
            // OR reuse the current page grid if it exists.
            // For simplicity, let's redirect to a virtual 'search' category on collection page or reuse current page if grid exists.

            const container = document.getElementById('product-container');
            if (container) {
                // If we are on a page with a grid, show results there
                document.querySelector('.section-title').textContent = `Search Results for "${query}"`;
                // Hide filters if searching
                const filters = document.querySelector('.filter-controls');
                if (filters) filters.style.display = 'none';

                renderProductGrid(results);
            } else {
                // If not on a product page, redirect to living.html (as a generic search page)
                // In a real app, we'd have search.html
                // Hack: Pass query via URL param
                window.location.href = `living.html?search=${encodeURIComponent(query)}`;
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// --- Mobile Menu ---
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
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
    window.location.href = 'index.html';
}

function checkLogin() {
    const userStr = localStorage.getItem('terraUser');
    const navAuth = document.getElementById('nav-auth');
    if (navAuth) {
        if (userStr) {
            const user = JSON.parse(userStr);
             navAuth.innerHTML = `<a href="profile.html">Profile (${user.username})</a>`;
        } else {
             navAuth.innerHTML = `<a href="login.html">Login</a>`;
        }
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkLogin();
    initSearch();
    initMobileMenu();

    // Check URL params for search
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = searchQuery;
         // Trigger search logic
         // We need to wait for loadProducts to finish or manually trigger
         // Since loadProducts is below, we need a slight delay or restructure.
         // Better: Let loadProducts run, then override if search exists.
         setTimeout(() => {
             const searchBtn = document.getElementById('search-btn');
             if(searchBtn) searchBtn.click();
         }, 100);
    } else {
        // Normal Category Loading
        const path = window.location.pathname;
        if (path.includes('living')) loadProducts('living');
        if (path.includes('kitchen')) loadProducts('kitchen');
        if (path.includes('wellness')) loadProducts('wellness');
    }

    if (window.location.pathname.includes('cart')) renderCart();
});
