// Test file for mobile order POST endpoint
// This demonstrates how to create a mobile order

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
  "notes": "Extra spicy please",
  "customerName": "John Doe",
  "customerPhone": "555-123-4567"
};

// Example curl command to test the endpoint:
/*
curl -X POST http://localhost:3000/api/v1/mobile-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
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
    "notes": "Extra spicy please",
    "customerName": "John Doe",
    "customerPhone": "555-123-4567"
  }'
*/

console.log('Sample mobile order data:', JSON.stringify(sampleMobileOrder, null, 2));
console.log('\nTo test the endpoint, use the curl command above with a valid JWT token.'); 