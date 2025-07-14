// Test file for mobile order POST endpoint
// This demonstrates how to create a mobile order

// Test customer data
const testCustomer = {
  "firstName": "Test",
  "lastName": "Customer",
  "email": "test@example.com",
  "phone": "123-456-7890",
  "password": "test123"
};

// Sample mobile order data
const sampleMobileOrder = {
  "items": [
    {
      "menuItem": {
        "id": "1",
        "name": "Tonkotsu Ramen",
        "price": 12.99
      },
      "quantity": 2,
      "selectedAddOns": [
        {
          "name": "Extra Chashu",
          "price": 3.50
        },
        {
          "name": "Soft Boiled Egg",
          "price": 1.50
        }
      ]
    },
    {
      "menuItem": {
        "id": "2",
        "name": "Gyoza",
        "price": 6.99
      },
      "quantity": 1,
      "selectedAddOns": []
    }
  ],
  "deliveryMethod": "Pickup",
  "deliveryAddress": null,
  "paymentMethod": "Cash",
  "notes": "Extra spicy please"
};

// Example curl commands to test:

/*
1. First, register a test customer:
curl -X POST http://localhost:3000/api/v1/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Customer",
    "email": "test@example.com",
    "phone": "123-456-7890",
    "password": "test123"
  }'

2. Then, login to get a token:
curl -X POST http://localhost:3000/api/v1/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

3. Finally, create a mobile order with the token:
curl -X POST http://localhost:3000/api/v1/mobile-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_FROM_LOGIN" \
  -d '{
    "items": [
      {
        "menuItem": {
          "id": "1",
          "name": "Tonkotsu Ramen",
          "price": 12.99
        },
        "quantity": 2,
        "selectedAddOns": [
          {
            "name": "Extra Chashu",
            "price": 3.50
          },
          {
            "name": "Soft Boiled Egg",
            "price": 1.50
          }
        ]
      }
    ],
    "deliveryMethod": "Pickup",
    "paymentMethod": "Cash",
    "notes": "Extra spicy please"
  }'
*/

console.log('Test customer data:', JSON.stringify(testCustomer, null, 2));
console.log('Sample mobile order data:', JSON.stringify(sampleMobileOrder, null, 2));
console.log('\nTo test the endpoint:');
console.log('1. Register a customer using the first curl command');
console.log('2. Login to get a token using the second curl command');
console.log('3. Create an order using the third curl command with your token'); 