// Remove the 'var user' declaration and use the global 'user' variable from the HTML script
if (!user.role || user.role !== 'admin') {
  window.location.href = 'pos.html';
}
// Fetch inventory from backend and render in table
const API_URL = 'http://localhost:3000/api/v1/inventory/all';
const CREATE_URL = 'http://localhost:3000/api/v1/inventory/create';
const UPDATE_URL = 'http://localhost:3000/api/v1/inventory/update/';
const DELETE_URL = 'http://localhost:3000/api/v1/inventory/delete/';
const ADD_MENU_URL = 'http://localhost:3000/api/v1/menu/newMenu';

function getStatusBadge(status) {
  if (status === 'in stock') return '<span class="badge bg-success">In Stock</span>';
  if (status === 'low stock') return '<span class="badge bg-warning text-dark">Low Stock</span>';
  if (status === 'out of stock') return '<span class="badge bg-danger">Out of Stock</span>';
  return status;
}

function renderIngredientsTable(ingredients) {
  const tbody = document.getElementById('ingredientsTableBody');
  if (!tbody) return;
  tbody.innerHTML = ingredients.map(ingredient => `
    <tr>
      <td>${ingredient.name}</td>
      <td>${ingredient.stocks}</td>
      <td>${ingredient.units}</td>
      <td>${ingredient.restocked ? new Date(ingredient.restocked).toLocaleDateString() : ''}</td>
      <td>${getStatusBadge(ingredient.status)}</td>
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
}

async function fetchInventory() {
  const token = localStorage.getItem('token');
  const tbody = document.getElementById('ingredientsTableBody');
  if (!token) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-danger">You must be logged in to view inventory.</td></tr>';
    return;
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
    renderIngredientsTable(ingredients);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-danger">Failed to load inventory data.</td></tr>';
  }
}

// Modal and form logic
let addIngredientModal;
document.addEventListener('DOMContentLoaded', () => {
  fetchInventory();

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
      document.getElementById('addIngredientError').style.display = 'none';
      addIngredientModal.show();
    });
  }

  // Handle add form submit
  const form = document.getElementById('addIngredientForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) {
        document.getElementById('addIngredientError').textContent = 'You must be logged in.';
        document.getElementById('addIngredientError').style.display = 'block';
        return;
      }
      const formData = new FormData(form);
      const body = {};
      formData.forEach((value, key) => {
        body[key] = value;
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
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
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
        restocked: document.getElementById('editIngredientRestocked').value,
        status: document.getElementById('editIngredientStatus').value
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
    addMenuBtn.addEventListener('click', () => {
      document.getElementById('addMenuForm').reset();
      document.getElementById('addMenuError').style.display = 'none';
      addMenuModal.show();
    });
  }

  // Handle add menu form submit
  const addMenuForm = document.getElementById('addMenuForm');
  if (addMenuForm) {
    addMenuForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addMenuForm);
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
  const token = localStorage.getItem('token');
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
    document.getElementById('editIngredientRestocked').value = ingredient.restocked ? new Date(ingredient.restocked).toISOString().split('T')[0] : '';
    document.getElementById('editIngredientStatus').value = ingredient.status;
    document.getElementById('editIngredientError').style.display = 'none';
    // Always create a new modal instance and show it
    const modalEl = document.getElementById('editIngredientModal');
    const editModal = new bootstrap.Modal(modalEl);
    editModal.show();
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
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
      const token = localStorage.getItem('token');
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
        fetchInventory();
        Swal.fire('Deleted!', 'Ingredient has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  });
} 