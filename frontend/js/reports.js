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
