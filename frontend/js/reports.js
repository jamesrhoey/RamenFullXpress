document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token; // Adjust if your token is stored differently

  fetch('http://localhost:3000/api/v1/sales/all-sales', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error(data.message || "Unexpected response");
      }
      const tbody = document.getElementById('salesTableBody');
      tbody.innerHTML = '';
      data.forEach(sale => {
        // Build the items list from menuItem and addOns
        const items = [];
        if (sale.menuItem && sale.menuItem.name) {
          items.push(`${sale.menuItem.name} x${sale.quantity}`);
        }
        if (Array.isArray(sale.addOns)) {
          sale.addOns.forEach(addOn => {
            if (addOn.menuItem && addOn.menuItem.name) {
              items.push(`${addOn.menuItem.name} x${addOn.quantity || 1}`);
            }
          });
        }

        // Calculate total price
        const totalPrice = sale.totalAmount || (sale.price * sale.quantity);

        // Format date (show only YYYY-MM-DD)
        const date = (sale.createdAt || sale.date || '').slice(0, 10);

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sale.orderID || sale._id}</td>
          <td>${sale.serviceType || ''}</td>
          <td>${items.join(', ')}</td>
          <td>₱${totalPrice.toFixed(2)}</td>
          <td>${date}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary" onclick="openTransactionModal('${sale.orderID || sale._id}', '${sale.serviceType || ''}', '${items.join(', ')}', '₱${totalPrice.toFixed(2)}', '${date}')">
              <i class="fas fa-eye"></i> View
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching sales data:', error);
    });
});

// Transaction Details Modal Function
function openTransactionModal(id, type, items, totalPrice, date) {
  document.getElementById("modalTransactionId").textContent = id;
  document.getElementById("modalOrderType").textContent = type;
  document.getElementById("modalItems").textContent = items;
  document.getElementById("modalTotalPrice").textContent = totalPrice;
  document.getElementById("modalDate").textContent = date;

  const transactionModal = new bootstrap.Modal(document.getElementById("transactionModal"));
  transactionModal.show();
}

// Expose to HTML onclick
window.openTransactionModal = openTransactionModal;