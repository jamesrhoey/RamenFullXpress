// Remove the 'var user' declaration and use the global 'user' variable from the HTML script
if (!user.role || user.role !== 'admin') {
  window.location.href = 'pos.html';
}

// Pagination variables
let allIngredients = [];
let filteredIngredients = [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch inventory from backend and render in table
const API_URL = 'http://localhost:3000/api/v1/inventory/all';
const CREATE_URL = 'http://localhost:3000/api/v1/inventory/create';
const UPDATE_URL = 'http://localhost:3000/api/v1/inventory/update/';
const DELETE_URL = 'http://localhost:3000/api/v1/inventory/delete/';
const ADD_MENU_URL = 'http://localhost:3000/api/v1/menu/newMenu';

function getStatusBadge(status, calculatedStatus, isOverridden) {
  let badgeClass = 'bg-success';
  if (status === 'low stock') badgeClass = 'bg-warning text-dark';
  if (status === 'out of stock') badgeClass = 'bg-danger';
  
  let badge = `<span class="badge ${badgeClass}">${status}</span>`;
  
  // Add override indicator if status differs from calculated
  if (isOverridden) {
    badge += ` <small class="text-muted">(override)</small>`;
  }
  
  return badge;
}

function renderIngredientsTableWithPagination(ingredients) {
  const tbody = document.getElementById('ingredientsTableBody');
  if (!tbody) return;

  const totalPages = Math.ceil(ingredients.length / itemsPerPage);
  
  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIngredients = ingredients.slice(startIndex, endIndex);
  
  if (currentIngredients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          <i class="fas fa-inbox fa-2x mb-2"></i>
          <div>No ingredients found</div>
        </td>
      </tr>
    `;
    updateInventoryPagination(0, 0);
    return;
  }

  tbody.innerHTML = currentIngredients.map(ingredient => `
    <tr>
      <td>${ingredient.name}</td>
      <td>${ingredient.stocks}</td>
      <td>${ingredient.units}</td>
      <td>${ingredient.restocked ? new Date(ingredient.restocked).toLocaleDateString() : ''}</td>
      <td>${getStatusBadge(ingredient.status, ingredient.calculatedStatus, ingredient.isStatusOverridden)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${ingredient._id}"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${ingredient._id}"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');

  // Attach event listeners for edit and delete
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => openEditModal(e.target.closest('button').dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => handleDelete(e.target.closest('button').dataset.id));
  });

  // Update pagination controls
  updateInventoryPagination(totalPages, ingredients.length);
}

function updateInventoryPagination(totalPages, totalItems) {
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');
  
  if (!prevBtn || !nextBtn || !pageInfo) return;

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Update page info
  pageInfo.textContent = `Page ${currentPage} of ${totalPages} (Showing ${startItem} to ${endItem} of ${totalItems} ingredients)`;

  // Update button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Update button styles
  if (currentPage === 1) {
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.classList.remove('disabled');
  }

  if (currentPage === totalPages) {
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.classList.remove('disabled');
  }
}

function changeInventoryPage(page) {
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderIngredientsTableWithPagination(filteredIngredients);
  }
}

async function fetchInventory() {
  const token = localStorage.getItem('authToken');
  const tbody = document.getElementById('ingredientsTableBody');
  if (!token) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-danger">You must be logged in to view inventory.</td></tr>';
    return;
  }

  // Show loading state
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="mt-2">Loading ingredients...</div>
        </td>
      </tr>
    `;
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch inventory');
    const data = await response.json();
    const ingredients = Array.isArray(data) ? data : data.data || [];
    
    // Store all ingredients and initialize filtered ingredients
    allIngredients = ingredients;
    filteredIngredients = [...ingredients];
    
    // Reset to first page
    currentPage = 1;
    
    renderIngredientsTableWithPagination(filteredIngredients);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-danger">Failed to load inventory data.</td></tr>';
  }
}

// Modal and form logic
let addIngredientModal;
document.addEventListener('DOMContentLoaded', () => {
  fetchInventory();

  // Add pagination event listeners
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeInventoryPage(currentPage - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeInventoryPage(currentPage + 1));
  }

  // Bootstrap modal instance for add
  const modalEl = document.getElementById('addIngredientModal');
  if (modalEl) {
    addIngredientModal = new bootstrap.Modal(modalEl);
  }

  // Open modal on button click
  const addBtn = document.getElementById('addIngredientBtn');
  if (addBtn && addIngredientModal) {
    addBtn.addEventListener('click', () => {
      document.getElementById('addIngredientForm').reset();
      // Set today's date as default for restock date
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('ingredientRestocked').value = today;
      document.getElementById('addIngredientError').style.display = 'none';
      addIngredientModal.show();
    });
  }

  // Handle add form submit
  const form = document.getElementById('addIngredientForm');
  if (form) {
    // Add event listener for stock quantity changes to suggest status
    const stocksInput = document.getElementById('ingredientStocks');
    const statusSelect = document.getElementById('ingredientStatus');
    if (stocksInput && statusSelect) {
      stocksInput.addEventListener('input', (e) => {
        const stocks = parseInt(e.target.value) || 0;
        let suggestedStatus = 'in stock';
        if (stocks <= 0) suggestedStatus = 'out of stock';
        else if (stocks <= 10) suggestedStatus = 'low stock';
        
        // Set as default if no status is selected yet
        if (!statusSelect.value || statusSelect.value === 'in stock') {
          statusSelect.value = suggestedStatus;
        }
        
        // Show suggestion
        statusSelect.title = `Calculated: ${suggestedStatus}`;
      });
    }
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('authToken');
      if (!token) {
        document.getElementById('addIngredientError').textContent = 'You must be logged in.';
        document.getElementById('addIngredientError').style.display = 'block';
        return;
      }
      const formData = new FormData(form);
      const body = {};
      formData.forEach((value, key) => {
        // Skip restocked field as it's set automatically by backend
        if (key !== 'restocked') {
          body[key] = value;
        }
      });
      try {
        const response = await fetch(CREATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to add ingredient');
        }
        addIngredientModal.hide();
        fetchInventory();
        Swal.fire('Success', 'Ingredient added successfully!', 'success');
      } catch (err) {
        document.getElementById('addIngredientError').textContent = err.message;
        document.getElementById('addIngredientError').style.display = 'block';
      }
    });
  }

  // Handle edit form submit (moved inside DOMContentLoaded)
  const editForm = document.getElementById('editIngredientForm');
  if (editForm) {
    // Add event listener for stock quantity changes to suggest status
    const stocksInput = document.getElementById('editIngredientStocks');
    const statusSelect = document.getElementById('editIngredientStatus');
    if (stocksInput && statusSelect) {
      stocksInput.addEventListener('input', (e) => {
        const stocks = parseInt(e.target.value) || 0;
        let suggestedStatus = 'in stock';
        if (stocks <= 0) suggestedStatus = 'out of stock';
        else if (stocks <= 10) suggestedStatus = 'low stock';
        
        // Show suggestion
        statusSelect.title = `Calculated: ${suggestedStatus}`;
      });
    }
    
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('authToken');
      if (!token) {
        document.getElementById('editIngredientError').textContent = 'You must be logged in.';
        document.getElementById('editIngredientError').style.display = 'block';
        return;
      }
      const id = document.getElementById('editIngredientId').value;
      const body = {
        name: document.getElementById('editIngredientName').value,
        stocks: document.getElementById('editIngredientStocks').value,
        units: document.getElementById('editIngredientUnits').value,
        status: document.getElementById('editIngredientStatus').value
        // restocked is set automatically by backend
      };
      try {
        const response = await fetch(UPDATE_URL + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update ingredient');
        }
        // Hide the modal after successful edit
        const modalEl = document.getElementById('editIngredientModal');
        const editModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        editModal.hide();
        fetchInventory();
        Swal.fire('Success', 'Ingredient updated successfully!', 'success');
      } catch (err) {
        document.getElementById('editIngredientError').textContent = err.message;
        document.getElementById('editIngredientError').style.display = 'block';
      }
    });
  }

  // Bootstrap modal instance for add menu
  const menuModalEl = document.getElementById('addMenuModal');
  if (menuModalEl) {
    addMenuModal = new bootstrap.Modal(menuModalEl);
  }

  // Open add menu modal on button click
  const addMenuBtn = document.getElementById('addMenuBtn');
  if (addMenuBtn && addMenuModal) {
    addMenuBtn.addEventListener('click', async () => {
      document.getElementById('addMenuForm').reset();
      document.getElementById('addMenuError').style.display = 'none';
      
      // Populate ingredients list
      await populateIngredientsList();
      
      addMenuModal.show();
    });
  }

  // Handle add menu form submit
  const addMenuForm = document.getElementById('addMenuForm');
  if (addMenuForm) {
    addMenuForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addMenuForm);
      
      // Get selected ingredients
      const selectedIngredients = [];
      document.querySelectorAll('.ingredient-checkbox:checked').forEach(checkbox => {
        const ingredientId = checkbox.value;
        const quantityInput = document.getElementById(`quantity_input_${ingredientId}`);
        const quantity = quantityInput ? parseFloat(quantityInput.value) || 1 : 1;
        
        selectedIngredients.push({
          name: checkbox.dataset.name,
          quantity: quantity,
          unit: checkbox.dataset.units
        });
      });
      
      // Add ingredients to form data
      formData.append('ingredients', JSON.stringify(selectedIngredients));
      
      try {
        const response = await fetch(ADD_MENU_URL, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (!response.ok || data.success === false) {
          throw new Error(data.message || 'Failed to add menu item');
        }
        addMenuModal.hide();
        Swal.fire('Success', 'Menu item added successfully!', 'success');
      } catch (err) {
        document.getElementById('addMenuError').textContent = err.message;
        document.getElementById('addMenuError').style.display = 'block';
      }
    });
  }
});

// Open edit modal and populate fields
async function openEditModal(id) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    Swal.fire('Error', 'You must be logged in.', 'error');
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/api/v1/inventory/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const ingredient = await res.json();
    if (!res.ok || ingredient.error || ingredient.message) {
      throw new Error(ingredient.error || ingredient.message || 'Failed to fetch ingredient');
    }
    document.getElementById('editIngredientId').value = ingredient._id;
    document.getElementById('editIngredientName').value = ingredient.name;
    document.getElementById('editIngredientStocks').value = ingredient.stocks;
    document.getElementById('editIngredientUnits').value = ingredient.units;
    // Show current restock date but it will be updated automatically
    document.getElementById('editIngredientRestocked').value = ingredient.restocked ? new Date(ingredient.restocked).toISOString().split('T')[0] : '';
    document.getElementById('editIngredientStatus').value = ingredient.status || 'in stock';
    
    // Show calculated status as tooltip
    const statusSelect = document.getElementById('editIngredientStatus');
    if (ingredient.calculatedStatus) {
      statusSelect.title = `Calculated: ${ingredient.calculatedStatus}`;
    }
    document.getElementById('editIngredientError').style.display = 'none';
    // Always create a new modal instance and show it
    const modalEl = document.getElementById('editIngredientModal');
    const editModal = new bootstrap.Modal(modalEl);
    editModal.show();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
}

// Populate ingredients list for menu creation
async function populateIngredientsList() {
  const token = localStorage.getItem('authToken');
  if (!token) return;
  
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch ingredients');
    const data = await response.json();
    const ingredients = Array.isArray(data) ? data : data.data || [];
    
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList) return;
    
    ingredientsList.innerHTML = ingredients.map(ingredient => `
      <div class="col-md-6 mb-2">
        <div class="form-check">
          <input class="form-check-input ingredient-checkbox" type="checkbox" 
                 id="ingredient_${ingredient._id}" value="${ingredient._id}" 
                 data-name="${ingredient.name}" data-units="${ingredient.units}">
          <label class="form-check-label" for="ingredient_${ingredient._id}">
            <strong>${ingredient.name}</strong>
            <br>
            <small class="text-muted">
              Stock: ${ingredient.stocks} ${ingredient.units} 
              <span class="badge ${ingredient.status === 'in stock' ? 'bg-success' : ingredient.status === 'low stock' ? 'bg-warning' : 'bg-danger'} ms-1">
                ${ingredient.status}
              </span>
            </small>
          </label>
          <div class="mt-2" id="quantity_${ingredient._id}" style="display: none;">
            <div class="input-group input-group-sm">
              <input type="number" class="form-control quantity-input" 
                     id="quantity_input_${ingredient._id}" 
                     placeholder="Quantity" min="0.1" step="0.1" value="1">
              <span class="input-group-text">${ingredient.units}</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Add event listeners for quantity inputs
    ingredients.forEach(ingredient => {
      const checkbox = document.getElementById(`ingredient_${ingredient._id}`);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const isChecked = e.target.checked;
          const quantityInput = document.getElementById(`quantity_${ingredient._id}`);
          if (quantityInput) {
            quantityInput.style.display = isChecked ? 'block' : 'none';
            if (!isChecked) quantityInput.value = '';
          }
        });
      }
    });
    
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    const ingredientsList = document.getElementById('ingredientsList');
    if (ingredientsList) {
      ingredientsList.innerHTML = '<div class="col-12 text-danger">Failed to load ingredients</div>';
    }
  }
}

// Handle delete
async function handleDelete(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the ingredient.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      try {
        const response = await fetch(DELETE_URL + id, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete ingredient');
        }
        
        // Refresh inventory and maintain current page if possible
        await fetchInventory();
        
        // If current page is now empty, go to previous page
        const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          currentPage = totalPages;
          renderIngredientsTableWithPagination(filteredIngredients);
        }
        
        Swal.fire('Deleted!', 'Ingredient has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  });
} 