// POS System JavaScript
class POSSystem {
    constructor() {
        this.cart = [];
        this.currentOrder = {
            id: this.generateOrderId(),
            items: [],
            orderType: 'dine-in',
            paymentMethod: 'cash',
            total: 0,
            subtotal: 0,
            discount: 0
        };
        this.menuItems = [];
        this.categories = ['All', 'Ramen', 'Rice Bowls', 'Side Dishes', 'Drinks'];
        this.addons = {
            'extraNoodles': { name: 'Extra Noodles', price: 50.00 },
            'extraChashu': { name: 'Extra Chashu', price: 80.00 },
            'extraEgg': { name: 'Extra Egg', price: 30.00 }
        };
        
        this.init();
    }

    init() {
        this.loadMenuItems();
        this.setupEventListeners();
        this.updateCartDisplay();
        this.setupSearchFunctionality();
        this.setupCategoryFilter();
    }

    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `#${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
    }

    loadMenuItems() {
        // Sample menu data - in real app this would come from API
        this.menuItems = [
            {
                id: 1,
                name: 'Tonkotsu Ramen',
                price: 249.00,
                category: 'Ramen',
                image: '../assets/ramen1.jpg',
                description: 'Rich pork bone broth with chashu pork'
            },
            {
                id: 2,
                name: 'Shoyu Ramen',
                price: 229.00,
                category: 'Ramen',
                image: '../assets/ramen2.jpg',
                description: 'Soy sauce based broth with tender pork'
            },
            {
                id: 3,
                name: 'Miso Ramen',
                price: 239.00,
                category: 'Ramen',
                image: '../assets/ramen3.jpg',
                description: 'Miso paste broth with vegetables'
            },
            {
                id: 4,
                name: 'Gyoza (6 pcs)',
                price: 129.00,
                category: 'Side Dishes',
                image: '../assets/ramen4.jpg',
                description: 'Pan-fried dumplings with dipping sauce'
            },
            {
                id: 5,
                name: 'Matcha Milk Tea',
                price: 99.00,
                category: 'Drinks',
                image: '../assets/ramen2.jpg',
                description: 'Refreshing green tea with milk'
            },
            {
                id: 6,
                name: 'Chicken Karaage',
                price: 149.00,
                category: 'Side Dishes',
                image: '../assets/ramen1.jpg',
                description: 'Japanese fried chicken with sauce'
            },
            {
                id: 7,
                name: 'Beef Rice Bowl',
                price: 199.00,
                category: 'Rice Bowls',
                image: '../assets/ricebowl.jpg',
                description: 'Tender beef over steamed rice'
            },
            {
                id: 8,
                name: 'Pork Rice Bowl',
                price: 179.00,
                category: 'Rice Bowls',
                image: '../assets/ricebowl2.jpg',
                description: 'Sliced pork over steamed rice'
            }
        ];
    }

    setupEventListeners() {
        // Product modal events
        const productModal = document.getElementById('productModal');
        if (productModal) {
            productModal.addEventListener('show.bs.modal', (event) => {
                this.handleModalShow(event);
            });
        }

        // Quantity controls
        const decrementBtn = document.getElementById('decrementQuantity');
        const incrementBtn = document.getElementById('incrementQuantity');
        const quantityInput = document.getElementById('productQuantity');

        if (decrementBtn && incrementBtn && quantityInput) {
            decrementBtn.addEventListener('click', () => this.decrementQuantity());
            incrementBtn.addEventListener('click', () => this.incrementQuantity());
            quantityInput.addEventListener('change', () => this.validateQuantity());
        }

        // Add to cart button
        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.addToCart());
        }

        // Order type buttons
        document.querySelectorAll('[data-order-type]').forEach(btn => {
            btn.addEventListener('click', (e) => this.setOrderType(e.target.dataset.orderType));
        });

        // Payment method buttons
        document.querySelectorAll('[data-payment-method]').forEach(btn => {
            btn.addEventListener('click', (e) => this.setPaymentMethod(e.target.dataset.paymentMethod));
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.processCheckout());
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.querySelector('.sidebar');

        if (sidebarToggle && closeSidebar && sidebar) {
            sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('show'));
            closeSidebar.addEventListener('click', () => sidebar.classList.remove('show'));
        }

        // Cart item controls
        this.setupCartItemControls();
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterMenuItems(e.target.value);
            });
        }
    }

    setupCategoryFilter() {
        const categoryButtons = document.querySelectorAll('.category-container .btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                categoryButtons.forEach(b => b.classList.remove('btn-danger'));
                categoryButtons.forEach(b => b.classList.add('btn-outline-danger'));
                
                // Add active class to clicked button
                e.target.classList.remove('btn-outline-danger');
                e.target.classList.add('btn-danger');
                
                const category = e.target.textContent.trim();
                this.filterByCategory(category);
            });
        });
    }

    setupCartItemControls() {
        // Delegate event listeners for cart item controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-item-quantity-btn')) {
                const itemId = e.target.closest('.cart-item').dataset.itemId;
                const action = e.target.closest('.cart-item-quantity-btn').dataset.action;
                
                if (action === 'decrease') {
                    this.decreaseCartItemQuantity(itemId);
                } else if (action === 'increase') {
                    this.increaseCartItemQuantity(itemId);
                }
            }
            
            if (e.target.closest('.cart-item-remove')) {
                const itemId = e.target.closest('.cart-item').dataset.itemId;
                this.removeFromCart(itemId);
            }
        });
    }

    handleModalShow(event) {
        const button = event.relatedTarget;
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');
        const category = button.getAttribute('data-category');
        
        // Set modal content
        document.getElementById('productModalTitle').textContent = name;
        document.getElementById('productModalPrice').textContent = `₱${price}`;
        document.getElementById('productModalImage').src = image;
        document.getElementById('productModalImage').alt = name;
        
        // Show/hide add-ons based on category
        const addonsSection = document.getElementById('addonsSection');
        if (category === 'Ramen') {
            addonsSection.classList.remove('d-none');
        } else {
            addonsSection.classList.add('d-none');
        }
        
        // Reset form
        document.getElementById('productQuantity').value = 1;
        document.getElementById('extraNoodles').checked = false;
        document.getElementById('extraChashu').checked = false;
        document.getElementById('extraEgg').checked = false;
        document.getElementById('specialInstructions').value = '';
        
        // Store current item data
        this.currentModalItem = {
            name,
            price: parseFloat(price),
            image,
            category
        };
    }

    decrementQuantity() {
        const quantityInput = document.getElementById('productQuantity');
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    }

    incrementQuantity() {
        const quantityInput = document.getElementById('productQuantity');
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    }

    validateQuantity() {
        const quantityInput = document.getElementById('productQuantity');
        let value = parseInt(quantityInput.value);
        if (value < 1) {
            quantityInput.value = 1;
        }
    }

    addToCart() {
        if (!this.currentModalItem) return;

        const quantity = parseInt(document.getElementById('productQuantity').value);
        const specialInstructions = document.getElementById('specialInstructions').value;
        
        // Get selected add-ons
        const selectedAddons = [];
        Object.keys(this.addons).forEach(addonKey => {
            const checkbox = document.getElementById(addonKey);
            if (checkbox && checkbox.checked) {
                selectedAddons.push({
                    name: this.addons[addonKey].name,
                    price: this.addons[addonKey].price
                });
            }
        });

        // Calculate total price for this item
        let itemPrice = this.currentModalItem.price;
        selectedAddons.forEach(addon => {
            itemPrice += addon.price;
        });

        const cartItem = {
            id: Date.now() + Math.random(),
            name: this.currentModalItem.name,
            price: itemPrice,
            quantity: quantity,
            addons: selectedAddons,
            specialInstructions: specialInstructions,
            total: itemPrice * quantity
        };

        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(item => 
            item.name === cartItem.name && 
            JSON.stringify(item.addons) === JSON.stringify(cartItem.addons) &&
            item.specialInstructions === cartItem.specialInstructions
        );

        if (existingItemIndex !== -1) {
            // Update existing item quantity
            this.cart[existingItemIndex].quantity += quantity;
            this.cart[existingItemIndex].total = this.cart[existingItemIndex].price * this.cart[existingItemIndex].quantity;
        } else {
            // Add new item
            this.cart.push(cartItem);
        }

        this.updateCartDisplay();
        this.updateTotal();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
        
        // Show success message
        this.showNotification('Item added to cart!', 'success');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== parseInt(itemId));
        this.updateCartDisplay();
        this.updateTotal();
        this.showNotification('Item removed from cart!', 'info');
    }

    decreaseCartItemQuantity(itemId) {
        const item = this.cart.find(item => item.id === parseInt(itemId));
        if (item && item.quantity > 1) {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.updateCartDisplay();
            this.updateTotal();
        } else if (item && item.quantity === 1) {
            this.removeFromCart(itemId);
        }
    }

    increaseCartItemQuantity(itemId) {
        const item = this.cart.find(item => item.id === parseInt(itemId));
        if (item) {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.updateCartDisplay();
            this.updateTotal();
        }
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cartItems');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<div class="text-center text-muted py-4">Cart is empty</div>';
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="border rounded p-2 mb-2 cart-item" data-item-id="${item.id}">
                <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column justify-content-between">
                        <strong class="mb-1">${item.name}</strong>
                        ${item.addons.length > 0 ? `<small class="text-muted">${item.addons.map(addon => addon.name).join(', ')}</small>` : ''}
                        ${item.specialInstructions ? `<small class="text-muted">Note: ${item.specialInstructions}</small>` : ''}
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-danger me-1 px-2 py-1 cart-item-quantity-btn" data-action="decrease">
                                <i class="fas fa-minus" style="font-size: 0.7rem;"></i>
                            </button>
                            <span class="mx-1">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-danger ms-1 px-2 py-1 cart-item-quantity-btn" data-action="increase">
                                <i class="fas fa-plus" style="font-size: 0.7rem;"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-end d-flex flex-column justify-content-between align-items-end">
                        <span class="text-danger">₱${item.total.toFixed(2)}</span>
                        <a href="#" class="text-danger small cart-item-remove"><i class="fas fa-trash-alt"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
        const total = subtotal;

        this.currentOrder.subtotal = subtotal;
        this.currentOrder.total = total;

        // Update display
        const totalElement = document.querySelector('.cart-footer h5.text-danger');
        if (totalElement) {
            totalElement.textContent = `₱${total.toFixed(2)}`;
        }

        // Update order number
        const orderNumberElement = document.querySelector('.card-header .text-muted');
        if (orderNumberElement) {
            orderNumberElement.textContent = this.currentOrder.id;
        }
    }

    setOrderType(type) {
        this.currentOrder.orderType = type;
        
        // Update button states
        document.querySelectorAll('[data-order-type]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.orderType === type) {
                btn.classList.add('active');
            }
        });
    }

    setPaymentMethod(method) {
        this.currentOrder.paymentMethod = method;
        
        // Update button states
        document.querySelectorAll('[data-payment-method]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.paymentMethod === method) {
                btn.classList.add('active');
            }
        });
    }

    filterMenuItems(searchTerm) {
        const menuItems = document.querySelectorAll('.menu-item');
        const term = searchTerm.toLowerCase();

        menuItems.forEach(item => {
            const name = item.querySelector('.card-title').textContent.toLowerCase();
            const category = item.dataset.category.toLowerCase();
            
            if (name.includes(term) || category.includes(term)) {
                item.closest('.col-6').style.display = '';
            } else {
                item.closest('.col-6').style.display = 'none';
            }
        });
    }

    filterByCategory(category) {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'All' || itemCategory === category) {
                item.closest('.col-6').style.display = '';
            } else {
                item.closest('.col-6').style.display = 'none';
            }
        });
    }

    processCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!', 'warning');
            return;
        }

        // Prepare order data
        const orderData = {
            ...this.currentOrder,
            items: [...this.cart],
            timestamp: new Date().toISOString()
        };

        // In a real application, this would be sent to the server
        console.log('Processing order:', orderData);
        
        // Show confirmation modal
        this.showOrderConfirmation(orderData);
    }

    showOrderConfirmation(orderData) {
        const modal = `
            <div class="modal fade" id="orderConfirmationModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Order Confirmation</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-3">
                                <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                                <h4 class="mt-2">Order Successful!</h4>
                                <p class="text-muted">Order ID: ${orderData.id}</p>
                            </div>
                            <div class="border rounded p-3">
                                <h6>Order Summary:</h6>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>₱${orderData.subtotal.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span>₱${orderData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-danger" onclick="posSystem.printReceipt()">Print Receipt</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('orderConfirmationModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modal);

        // Show modal
        const newModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
        newModal.show();

        // Clear cart after successful order
        this.clearCart();
    }

    clearCart() {
        this.cart = [];
        this.currentOrder = {
            id: this.generateOrderId(),
            items: [],
            orderType: 'dine-in',
            paymentMethod: 'cash',
            total: 0,
            subtotal: 0,
            discount: 0
        };
        this.updateCartDisplay();
        this.updateTotal();
    }

    printReceipt() {
        // In a real application, this would generate and print a receipt
        const receiptWindow = window.open('', '_blank');
        receiptWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body { font-family: monospace; margin: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .item { margin: 5px 0; }
                        .total { border-top: 1px solid #000; margin-top: 20px; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>RamenXpress</h2>
                        <p>Order #${this.currentOrder.id}</p>
                        <p>${new Date().toLocaleString()}</p>
                    </div>
                    <div class="items">
                        ${this.cart.map(item => `
                            <div class="item">
                                <div>${item.name} x${item.quantity}</div>
                                <div>₱${item.total.toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="total">
                        <div>Subtotal: ₱${this.currentOrder.subtotal.toFixed(2)}</div>
                        <div><strong>Total: ₱${this.currentOrder.total.toFixed(2)}</strong></div>
                    </div>
                </body>
            </html>
        `);
        receiptWindow.document.close();
        receiptWindow.print();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize POS system when DOM is loaded
let posSystem;
document.addEventListener('DOMContentLoaded', function() {
    posSystem = new POSSystem();
});

// Global functions for HTML onclick handlers
function setOrderType(type) {
    if (posSystem) posSystem.setOrderType(type);
}

function setPaymentMethod(method) {
    if (posSystem) posSystem.setPaymentMethod(method);
}

function printReceipt() {
    if (posSystem) posSystem.printReceipt();
} 