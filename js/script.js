// --- INITIALIZATION ---
const cartCount = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
// --- CART SYSTEM ---
let cart = [];

// --- CARD-LEVEL ADD TO CART ---
document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card's modal from opening
        const card = e.target.closest('.card');
        const product = {
            name: card.getAttribute('data-name'),
            price: parseInt(card.getAttribute('data-price')),
            img: card.getAttribute('data-img')
        };
        cart.push(product);
        updateCartUI();
        showToast(`${product.name} added to cart!`);
    });
});

// --- CART UI UPDATES ---
function updateCartUI() {
    // Update counters
    const count = cart.length;
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'inline-block' : 'none';
    }

    const mobileCount = document.getElementById('cartCountMobile');
    if (mobileCount) {
        mobileCount.textContent = count;
        mobileCount.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // Update Cart Modal list
    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" width="40" height="40" class="rounded me-2" style="object-fit: contain;">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">₹${item.price}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">&times;</button>
                </div>
            `).join('');
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
    }

    // --- Update Checkout Summary Column ---
    const checkoutSummaryList = document.getElementById('checkoutSummaryList');
    if (checkoutSummaryList) {
        if (cart.length === 0) {
            checkoutSummaryList.innerHTML = '<p class="text-center text-muted py-4">No items to review.</p>';
        } else {
            checkoutSummaryList.innerHTML = cart.map(item => `
                <div class="summary-item">
                    <span>${item.name}</span>
                    <span class="fw-bold">₹${item.price}</span>
                </div>
            `).join('');
        }
    }

    // Update totals
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotal) cartTotal.textContent = `₹${total}`;

    const subtotalEl = document.getElementById('subtotalPrice');
    const totalEl = document.getElementById('finalTotalPrice');
    if (subtotalEl) subtotalEl.textContent = `₹${total}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `<i class="fas fa-check-circle me-2 text-success"></i> ${message}`;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// --- SCROLL REVEAL LOGIC ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- SURPRISE ENHANCEMENTS ---

// 1. Dynamic Navbar & Scroll-to-Top
const navbar = document.querySelector('.navbar');
const scrollBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (scrollBtn) scrollBtn.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        if (scrollBtn) scrollBtn.classList.remove('show');
    }
});

if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- FORM VALIDATION ---
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', event => {
        if (!paymentForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            alert('Payment Successful! Thank you for shopping with OrganicStore.');
            paymentForm.classList.remove('was-validated');
            paymentForm.reset();
        }
        paymentForm.classList.add('was-validated');
    }, false);
}
