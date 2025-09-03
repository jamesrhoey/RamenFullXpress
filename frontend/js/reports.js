// Global variables for pagination and filtering
let allTransactions = [];
let filteredTransactions = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user.token; // Adjust if your token is stored differently

  // Show loading state
  const tbody = document.getElementById('salesTableBody');
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-2">Loading transactions...</div>
      </td>
    </tr>
  `;

  // Fetch both sales and mobile orders
  Promise.allSettled([
  fetch(`${getApiUrl()}/sales/all-sales`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view sales data.');
        } else {
          throw new Error(`Sales API error: ${response.status}`);
        }
      }
      return response.json();
    }),
    fetch(`${getApiUrl()}/mobile-orders/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view mobile orders.');
        } else {
          throw new Error(`Mobile orders API error: ${response.status}`);
        }
      }
      return response.json();
    })
  ])
    .then(([salesResult, mobileOrdersResult]) => {
      let salesData = [];
      let mobileOrdersData = [];
      let errors = [];

      // Process sales result
      if (salesResult.status === 'fulfilled') {
        if (Array.isArray(salesResult.value)) {
          salesData = salesResult.value;
        } else {
          errors.push('Unexpected sales response format');
        }
      } else {
        errors.push(`Sales: ${salesResult.reason.message}`);
      }

      // Process mobile orders result
      if (mobileOrdersResult.status === 'fulfilled') {
        if (Array.isArray(mobileOrdersResult.value)) {
          mobileOrdersData = mobileOrdersResult.value;
        } else {
          errors.push('Unexpected mobile orders response format');
        }
      } else {
        errors.push(`Mobile Orders: ${mobileOrdersResult.reason.message}`);
      }

      // Show warning if there were partial errors
      if (errors.length > 0 && (salesData.length > 0 || mobileOrdersData.length > 0)) {
        console.warn('Partial data loaded with errors:', errors);
        // You could show a warning toast here
      }

      // Process and combine data
      let totalRevenue = 0;
      let totalOrders = 0;
      let orderTypeCounts = { 'dine-in': 0, 'pickup': 0, 'delivery': 0 };

      console.log('Processing sales data:', salesData.length, 'records');
      console.log('Processing mobile orders data:', mobileOrdersData.length, 'records');

      // Process sales data
      salesData.forEach(sale => {
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

        const totalPrice = sale.totalAmount || (sale.price * sale.quantity);
        const date = (sale.createdAt || sale.date || '').slice(0, 10);
        const orderType = sale.serviceType || 'pickup';
        
        // Count order types
        if (orderType === 'dine-in') orderTypeCounts['dine-in']++;
        else orderTypeCounts['pickup']++;

        totalRevenue += totalPrice;
        totalOrders++;

        allTransactions.push({
          id: sale.orderID || sale._id,
          type: orderType,
          items: items.join(', '),
          totalPrice: totalPrice,
          date: date,
          source: 'sales',
          originalData: sale
        });
      });

      // Process mobile orders data
      mobileOrdersData.forEach(order => {
        const items = [];
        if (Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (item.menuItem && item.menuItem.name) {
              items.push(`${item.menuItem.name} x${item.quantity}`);
            }
            if (Array.isArray(item.selectedAddOns)) {
              item.selectedAddOns.forEach(addOn => {
                items.push(`${addOn.name} x1`);
              });
            }
          });
        }

        const totalPrice = order.total || 0;
        const date = (order.createdAt || order.orderDate || '').slice(0, 10);
        const orderType = order.deliveryMethod === 'Delivery' ? 'delivery' : 'pickup';
        
        // Count order types
        if (orderType === 'delivery') orderTypeCounts['delivery']++;
        else orderTypeCounts['pickup']++;

        totalRevenue += totalPrice;
        totalOrders++;

        allTransactions.push({
          id: order.orderId || order._id,
          type: orderType,
          items: items.join(', '),
          totalPrice: totalPrice,
          date: date,
          source: 'mobile',
          originalData: order
        });
      });

      console.log('Combined data summary:', {
        totalTransactions: allTransactions.length,
        totalRevenue,
        totalOrders,
        orderTypeCounts
      });

      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      filteredTransactions = [...allTransactions]; // Initialize filtered transactions

      // Update summary cards
      updateSummaryCards(totalRevenue, totalOrders, orderTypeCounts);

      // Display transactions with pagination
      displayTransactionsWithPagination(filteredTransactions);

      // Show success message if no transactions
      if (allTransactions.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              <i class="fas fa-inbox fa-2x mb-2"></i>
              <div>No transactions found</div>
            </td>
          </tr>
        `;
      }

      // Show partial data warning if needed
      if (errors.length > 0 && allTransactions.length > 0) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning alert-dismissible fade show';
        warningDiv.innerHTML = `
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>Partial Data Loaded:</strong> ${errors.join(', ')}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.main-content').insertBefore(warningDiv, document.querySelector('.main-content').firstChild);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Show error message to user
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">
            <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
            <div>Error loading data: ${error.message}</div>
            <small class="text-muted">Please check your connection and try again</small>
          </td>
        </tr>
      `;
    });
});

function updateSummaryCards(totalRevenue, totalOrders, orderTypeCounts) {
  try {
    // Update profit (assuming 40% profit margin for demo)
    const profit = totalRevenue * 0.4;
    const profitElement = document.querySelector('.summary-card:nth-child(1) .stat');
    if (profitElement) {
      profitElement.textContent = `₱${profit.toFixed(0)}`;
    }
    
    // Update total orders
    const ordersElement = document.querySelector('.summary-card:nth-child(2) .stat');
    if (ordersElement) {
      ordersElement.textContent = totalOrders;
    }
    
    // Update order types - find the third summary card
    const orderTypeCard = document.querySelectorAll('.summary-card')[2];
    if (orderTypeCard) {
      const orderTypeStats = orderTypeCard.querySelector('.stat');
      const orderTypeDesc = orderTypeCard.querySelector('.desc');
      
      if (orderTypeStats) {
        orderTypeStats.innerHTML = `
          <span>${orderTypeCounts['dine-in']}</span>
          <span>${orderTypeCounts['pickup']}</span>
          <span>${orderTypeCounts['delivery']}</span>
        `;
      }
      
      if (orderTypeDesc) {
        orderTypeDesc.innerHTML = `
          <span>Dine In</span>
          <span>Pick Up</span>
          <span>Delivery</span>
        `;
      }
    }
    
    // Update revenue
    const revenueElement = document.querySelector('.summary-card:nth-child(4) .stat');
    if (revenueElement) {
      revenueElement.textContent = `₱${totalRevenue.toFixed(0)}`;
    }
    
    console.log('Summary cards updated successfully:', {
      profit: profit.toFixed(0),
      totalOrders,
      orderTypeCounts,
      totalRevenue: totalRevenue.toFixed(0)
    });
    
  } catch (error) {
    console.error('Error updating summary cards:', error);
  }
}

function displayTransactionsWithPagination(transactions) {
  const tbody = document.getElementById('salesTableBody');
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);
  
  tbody.innerHTML = '';

  if (currentTransactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          <i class="fas fa-search fa-2x mb-2"></i>
          <div>No transactions match your filters</div>
        </td>
      </tr>
    `;
    updatePaginationControls(0, 0);
    return;
  }

  currentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
    const sourceBadge = transaction.source === 'mobile' ? 
      '<span class="badge bg-info me-1">Mobile</span>' : 
      '<span class="badge bg-success me-1">POS</span>';
    
        row.innerHTML = `
      <td>${sourceBadge}${transaction.id}</td>
      <td>${transaction.type}</td>
      <td>${transaction.items}</td>
      <td>₱${transaction.totalPrice.toFixed(2)}</td>
      <td>${transaction.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary" onclick="openTransactionModal('${transaction.id}', '${transaction.type}', '${transaction.items.replace(/'/g, "\\'")}', '₱${transaction.totalPrice.toFixed(2)}', '${transaction.date}', '${transaction.source}')">
              <i class="fas fa-eye"></i> View
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

  // Update pagination controls
  updatePaginationControls(totalPages, transactions.length);
}

function updatePaginationControls(totalPages, totalItems) {
  const paginationContainer = document.querySelector('.pagination-container');
  if (!paginationContainer) {
    // Create pagination container if it doesn't exist
    const tableContainer = document.querySelector('.table-responsive');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-container d-flex justify-content-between align-items-center mt-4';
    tableContainer.parentNode.insertBefore(paginationDiv, tableContainer.nextSibling);
  }

  const container = document.querySelector('.pagination-container');
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  container.innerHTML = `
    <div class="pagination-info">
      Showing ${startItem} to ${endItem} of ${totalItems} transactions
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination mb-0">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
          </a>
        </li>
        ${generatePageNumbers(currentPage, totalPages)}
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>
            Next <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  `;
}

function generatePageNumbers(currentPage, totalPages) {
  let pageNumbers = '';
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>
      `;
    }
  } else {
    // Show limited pages with ellipsis
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
        `;
      }
      pageNumbers += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
        </li>
      `;
    } else if (currentPage >= totalPages - 2) {
      pageNumbers += `
        <li class="page-item">
          <a class="page-link" href="#" onclick="changePage(1)">1</a>
        </li>
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
        `;
      }
    } else {
      pageNumbers += `
        <li class="page-item">
          <a class="page-link" href="#" onclick="changePage(1)">1</a>
        </li>
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
      `;
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
          </li>
        `;
      }
      pageNumbers += `
        <li class="page-item disabled">
          <span class="page-link">...</span>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
        </li>
      `;
    }
  }
  
  return pageNumbers;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayTransactionsWithPagination(filteredTransactions);
  }
}

// Transaction Details Modal Function
function openTransactionModal(id, type, items, totalPrice, date, source) {
  document.getElementById("modalTransactionId").textContent = id;
  document.getElementById("modalOrderType").textContent = type;
  document.getElementById("modalItems").textContent = items;
  document.getElementById("modalTotalPrice").textContent = totalPrice;
  document.getElementById("modalDate").textContent = date;

  // Add source information to modal
  const sourceInfo = document.getElementById("modalSource");
  if (sourceInfo) {
    sourceInfo.textContent = source === 'mobile' ? 'Mobile Order' : 'POS Sale';
  }

  const transactionModal = new bootstrap.Modal(document.getElementById("transactionModal"));
  transactionModal.show();
}

// Search and filter functionality
function filterTransactions() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const startDate = document.getElementById('filterStartDate').value;
  const orderType = document.getElementById('filterOrderType').value;
  
  // Filter transactions
  filteredTransactions = allTransactions.filter(transaction => {
    const id = transaction.id.toLowerCase();
    const type = transaction.type.toLowerCase();
    const items = transaction.items.toLowerCase();
    const date = transaction.date;
    
    const matchesSearch = id.includes(searchTerm) || type.includes(searchTerm) || items.includes(searchTerm);
    const matchesDate = !startDate || date >= startDate;
    const matchesOrderType = !orderType || type === orderType;
    
    return matchesSearch && matchesDate && matchesOrderType;
  });

  // Reset to first page when filtering
  currentPage = 1;
  
  // Display filtered results
  displayTransactionsWithPagination(filteredTransactions);
}

// Add event listeners for search and filter
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const filterStartDate = document.getElementById('filterStartDate');
  const filterOrderType = document.getElementById('filterOrderType');
  
  if (searchInput) {
    searchInput.addEventListener('input', filterTransactions);
  }
  
  if (filterStartDate) {
    filterStartDate.addEventListener('change', filterTransactions);
  }
  
  if (filterOrderType) {
    filterOrderType.addEventListener('change', filterTransactions);
  }
});

// Expose to HTML onclick
window.openTransactionModal = openTransactionModal;