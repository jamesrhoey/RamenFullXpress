// Mobile Order Management JavaScript

const API_BASE_URL = "http://localhost:3000/api/v1";
const authToken = localStorage.getItem("token"); // For admin/cashier authentication

let loadedOrders = [];

document.addEventListener("DOMContentLoaded", function () {
    loadMobileOrders();
    // initializeFilters(); // Uncomment if you have filter logic
});

// Load mobile orders from backend
async function loadMobileOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/mobile-orders/all`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const orders = await response.json();
        loadedOrders = orders; // Store for modal use
        displayOrders(orders);
    } catch (error) {
        console.error("Error loading mobile orders:", error);
        showNotification("Failed to load orders. Please check your connection.", "error");
    }
}

// Display orders in the table
function displayOrders(orders) {
    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = "";

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <br>No orders found
                </td>
            </tr>
        `;
        return;
    }

    orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleString();
        const statusBadge = getStatusBadge(order.status);
        // Infer payment status if missing
        let paymentStatus = order.paymentStatus;
        if (!paymentStatus) {
            if (order.paymentMethod && order.paymentMethod.toLowerCase() !== 'cash on delivery') {
                paymentStatus = 'paid';
            } else {
                paymentStatus = 'pending';
            }
        }
        const paymentBadge = getPaymentBadge(paymentStatus);
        const row = document.createElement("tr");
        // Try to get customer name from customerName, or from populated customerId
        let customerName = order.customerName;
        if (!customerName && order.customerId) {
            if (order.customerId.fullName) {
                customerName = order.customerId.fullName;
            } else if (order.customerId.name) {
                customerName = order.customerId.name;
            } else if (order.customerId.firstName || order.customerId.lastName) {
                customerName = `${order.customerId.firstName || ''} ${order.customerId.lastName || ''}`.trim();
            }
        }
        row.innerHTML = `
            <td>#${order.orderId || order._id}</td>
            <td>${customerName || "N/A"}</td>
            <td>${orderDate}</td>
            <td>₱${order.total ? order.total.toFixed(2) : "0.00"}</td>
            <td>${paymentBadge}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails('${order._id}')">View</button>
                <button class="btn btn-sm btn-outline-success" onclick="updateOrderStatus('${order._id}')">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Status badge
function getStatusBadge(status) {
    const map = {
        pending: '<span class="badge bg-secondary">Pending</span>',
        preparing: '<span class="badge bg-warning text-dark">Preparing</span>',
        ready: '<span class="badge bg-info">Ready</span>',
        delivered: '<span class="badge bg-success">Delivered</span>',
        cancelled: '<span class="badge bg-danger">Cancelled</span>'
    };
    return map[status] || map["pending"];
}

// Payment badge
function getPaymentBadge(status) {
    const map = {
        paid: '<span class="badge bg-success">Paid</span>',
        pending: '<span class="badge bg-warning text-dark">Pending</span>',
        failed: '<span class="badge bg-danger">Failed</span>'
    };
    return map[status] || map["pending"];
}

// Show notification
function showNotification(message, type = "info") {
    const alertClass = type === "error" ? "alert-danger" : type === "success" ? "alert-success" : "alert-info";
    const notification = document.createElement("div");
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 5000);
}

window.viewOrderDetails = function(orderId) {
    const order = loadedOrders.find(o => o._id === orderId);
    if (!order) {
        showNotification("Order not found.", "error");
        return;
    }
    // Customer info
    let customerName = order.customerName;
    let customerPhone = "";
    let customerAddress = order.deliveryAddress || "";
    if (!customerName && order.customerId) {
        if (order.customerId.fullName) {
            customerName = order.customerId.fullName;
        } else if (order.customerId.name) {
            customerName = order.customerId.name;
        } else if (order.customerId.firstName || order.customerId.lastName) {
            customerName = `${order.customerId.firstName || ''} ${order.customerId.lastName || ''}`.trim();
        }
        customerPhone = order.customerId.phone || "";
        if (!customerAddress) customerAddress = order.customerId.address || "";
    }
    document.getElementById('modalOrderId').textContent = `#${order.orderId || order._id}`;
    document.getElementById('modalOrderDate').textContent = new Date(order.createdAt).toLocaleString();
    document.getElementById('modalCustomerName').textContent = customerName || "N/A";
    document.getElementById('modalCustomerPhone').textContent = customerPhone;
    document.getElementById('modalCustomerAddress').textContent = customerAddress || "N/A";
    // Status badges
    const orderStatusElement = document.getElementById('modalOrderStatus');
    const paymentStatusElement = document.getElementById('modalPaymentStatus');
    orderStatusElement.className = 'badge';
    paymentStatusElement.className = 'badge';
    // Set status classes
    switch(order.status) {
        case 'processing':
        case 'preparing':
            orderStatusElement.classList.add('bg-warning', 'text-dark');
            break;
        case 'delivered':
            orderStatusElement.classList.add('bg-success');
            break;
        case 'pending':
            orderStatusElement.classList.add('bg-secondary');
            break;
        case 'ready':
            orderStatusElement.classList.add('bg-info');
            break;
        case 'cancelled':
            orderStatusElement.classList.add('bg-danger');
            break;
        default:
            orderStatusElement.classList.add('bg-secondary');
    }
    // Infer payment status if missing
    let paymentStatus = order.paymentStatus;
    if (!paymentStatus) {
        if (order.paymentMethod && order.paymentMethod.toLowerCase() !== 'cash on delivery') {
            paymentStatus = 'paid';
        } else {
            paymentStatus = 'pending';
        }
    }
    switch(paymentStatus) {
        case 'paid':
            paymentStatusElement.classList.add('bg-success');
            break;
        case 'pending':
            paymentStatusElement.classList.add('bg-warning', 'text-dark');
            break;
        case 'failed':
            paymentStatusElement.classList.add('bg-danger');
            break;
        default:
            paymentStatusElement.classList.add('bg-secondary');
    }
    orderStatusElement.textContent = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "N/A";
    paymentStatusElement.textContent = paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : "N/A";
    // Order items
    const tbody = document.getElementById('modalOrderItems');
    tbody.innerHTML = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            const name = item.menuItem && item.menuItem.name ? item.menuItem.name : 'N/A';
            const price = item.menuItem && typeof item.menuItem.price === 'number' ? item.menuItem.price : 0;
            const image = item.menuItem && item.menuItem.image ? item.menuItem.image : 'logo.png';
            const quantity = item.quantity || 0;
            // Add-ons
            let addOnsHtml = '';
            let addOnsTotal = 0;
            if (item.selectedAddOns && item.selectedAddOns.length > 0) {
                addOnsHtml = '<ul class="mb-0 ps-3 small text-muted">';
                item.selectedAddOns.forEach(addOn => {
                    addOnsHtml += `<li>${addOn.name} (+₱${addOn.price.toFixed(2)})</li>`;
                    addOnsTotal += addOn.price;
                });
                addOnsHtml += '</ul>';
            }
            const itemUnitTotal = price + addOnsTotal;
            const subtotal = itemUnitTotal * quantity;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <div class="item-image me-3">
                            <img src="../assets/${image}" alt="${name}" class="menu-item-img">
                        </div>
                        <div>
                            <div class="fw-semibold">${name}</div>
                            ${addOnsHtml}
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <span class="badge bg-light text-dark">${quantity}</span>
                </td>
                <td class="text-end">₱${itemUnitTotal.toFixed(2)}</td>
                <td class="text-end fw-semibold">₱${subtotal.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No items</td></tr>';
    }
    // Summary
    // Subtotal row removed from modal, so do not set modalSubtotal
    document.getElementById('modalDeliveryFee').textContent = `₱${order.deliveryFee ? order.deliveryFee.toFixed(2) : '0.00'}`;
    // Calculate total: sum of all item subtotals (including add-ons) + deliveryFee
    let computedTotal = 0;
    if (order.items && order.items.length > 0) {
        computedTotal = order.items.reduce((sum, item) => {
            const price = item.menuItem && typeof item.menuItem.price === 'number' ? item.menuItem.price : 0;
            const quantity = item.quantity || 0;
            let addOnsTotal = 0;
            if (item.selectedAddOns && item.selectedAddOns.length > 0) {
                addOnsTotal = item.selectedAddOns.reduce((aSum, addOn) => aSum + (addOn.price || 0), 0);
            }
            const itemUnitTotal = price + addOnsTotal;
            return sum + (itemUnitTotal * quantity);
        }, 0);
    }
    computedTotal += order.deliveryFee ? order.deliveryFee : 0;
    document.getElementById('modalTotal').textContent = `₱${computedTotal.toFixed(2)}`;
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
};

window.updateOrderStatus = function(orderId) {
    const order = loadedOrders.find(o => o._id === orderId);
    if (!order) {
        showNotification("Order not found.", "error");
        return;
    }
    // Set current status badge
    const currentStatusSpan = document.getElementById('updateModalCurrentStatus');
    currentStatusSpan.className = 'badge';
    switch(order.status) {
        case 'processing':
        case 'preparing':
            currentStatusSpan.classList.add('bg-warning', 'text-dark');
            break;
        case 'delivered':
            currentStatusSpan.classList.add('bg-success');
            break;
        case 'pending':
            currentStatusSpan.classList.add('bg-secondary');
            break;
        case 'ready':
            currentStatusSpan.classList.add('bg-info');
            break;
        case 'cancelled':
            currentStatusSpan.classList.add('bg-danger');
            break;
        default:
            currentStatusSpan.classList.add('bg-secondary');
    }
    currentStatusSpan.textContent = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "N/A";
    // Set select to current status
    const statusSelect = document.getElementById('updateModalNewStatus');
    statusSelect.value = order.status || 'pending';
    // Clear notes
    document.getElementById('updateModalNotes').value = '';
    // Store orderId for confirm
    statusSelect.setAttribute('data-order-id', orderId);
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('updateOrderStatusModal'));
    modal.show();
};

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for confirm button
    document.getElementById('updateModalConfirmBtn').addEventListener('click', async function() {
        const statusSelect = document.getElementById('updateModalNewStatus');
        const newStatus = statusSelect.value;
        const orderId = statusSelect.getAttribute('data-order-id');
        const notes = document.getElementById('updateModalNotes').value;
        try {
            const response = await fetch(`${API_BASE_URL}/mobile-orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ status: newStatus, notes })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            // Update local data and UI
            const updatedOrder = await response.json();
            const idx = loadedOrders.findIndex(o => o._id === orderId);
            if (idx !== -1) {
                loadedOrders[idx] = { ...loadedOrders[idx], ...updatedOrder };
            }
            displayOrders(loadedOrders);
            showNotification(`Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}!`, 'success');
            // Hide modal
            const modalEl = document.getElementById('updateOrderStatusModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        } catch (error) {
            showNotification('Failed to update order status.', 'error');
        }
    });
}); 