ang port ay 3000
mongodb://localhost:27017/ramenxpressApp

# API Endpoints

## Register
POST http://localhost:3000/api/v1/auth/register
Body (JSON):
{
  "username": "adminuser",
  "password": "securepassword",
  "role": "admin" // or "cashier"
}

## Login
POST http://localhost:3000/api/v1/auth/login
Body (JSON):
{
  "username": "adminuser",
  "password": "securepassword"
}

## Inventory

### Get all inventory items
GET http://localhost:3000/api/v1/inventory
Headers:
- Authorization: Bearer <token>

### Get a single inventory item by ID
GET http://localhost:3000/api/v1/inventory/{id}
Headers:
- Authorization: Bearer <token>

### Create a new inventory item
POST http://localhost:3000/api/v1/inventory
Headers:
- Content-Type: application/json
- Authorization: Bearer <token>
Body (JSON):
{
  "name": "Tonkotsu Ramen",
  "stocks": 50,
  "units": "bowl",
  "restocked": "2024-05-01T00:00:00.000Z",
  "status": "in stock"
}

### Update an inventory item
PUT http://localhost:3000/api/v1/inventory/{id}
Headers:
- Content-Type: application/json
- Authorization: Bearer <token>
Body (JSON): (same as POST)

### Delete an inventory item
DELETE http://localhost:3000/api/v1/inventory/{id}
Headers:
- Authorization: Bearer <token>

## Sales (Admin Only)

### Create a new sale
POST http://localhost:3000/api/v1/sales
Headers:
- Content-Type: application/json
- Authorization: Bearer <token>
Body (JSON):
{
  "item": "Tonkotsu Ramen",
  "quantity": 2,
  "total": 500,
  "notes": "Extra spicy"
}

### Get all sales
GET http://localhost:3000/api/v1/sales
Headers:
- Authorization: Bearer <token>

### Get a sale by ID
GET http://localhost:3000/api/v1/sales/{id}
Headers:
- Authorization: Bearer <token>

### Update a sale by ID
PUT http://localhost:3000/api/v1/sales/{id}
Headers:
- Content-Type: application/json
- Authorization: Bearer <token>
Body (JSON):
{
  "item": "Tonkotsu Ramen",
  "quantity": 3,
  "total": 750,
  "notes": "Changed quantity"
}

### Delete a sale by ID
DELETE http://localhost:3000/api/v1/sales/{id}
Headers:
- Authorization: Bearer <token>



