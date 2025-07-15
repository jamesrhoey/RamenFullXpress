// Fetch inventory from backend and render in table
const API_URL = 'http://localhost:3000/api/v1/inventory/all';

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
        <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
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

document.addEventListener('DOMContentLoaded', fetchInventory); 