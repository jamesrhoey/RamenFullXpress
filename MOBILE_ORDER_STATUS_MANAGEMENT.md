# Mobile Order Status Management Guide

## Overview

This guide explains how to manage and update order statuses in the ramen mobile app system across all platforms (Web Dashboard, Mobile App, and Backend API).

## Order Status Flow

### Status Types

1. **pending** - Order received, waiting to be processed
2. **preparing** - Order is being prepared in the kitchen
3. **ready** - Order is ready for pickup/delivery
4. **delivered** - Order has been delivered to customer
5. **cancelled** - Order has been cancelled

### Valid Status Transitions

```
pending → preparing, cancelled
preparing → ready, cancelled
ready → delivered, cancelled
delivered → (final state)
cancelled → (final state)
```

## Backend API Endpoints

### Update Order Status

```http
PUT /api/mobile-orders/status/:orderId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "preparing",
  "notes": "Kitchen started preparing the order"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order status updated to preparing",
  "order": {
    "id": "orderId",
    "status": "preparing",
    "statusHistory": [...],
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Status History

```http
GET /api/mobile-orders/status/:orderId/history
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusHistory": [
    {
      "status": "pending",
      "timestamp": "2024-01-15T10:00:00Z",
      "updatedBy": "system",
      "notes": "Order created"
    },
    {
      "status": "preparing",
      "timestamp": "2024-01-15T10:30:00Z",
      "updatedBy": "cashier1",
      "notes": "Kitchen started preparing"
    }
  ],
  "currentStatus": "preparing"
}
```

## Web Dashboard Usage

### Updating Status via Web Interface

1. Navigate to Mobile Orders page
2. Click "Update" button on any order
3. Select new status from dropdown
4. Add optional notes
5. Click "Update Status"

### Features

- Real-time status updates
- Status validation
- Status history tracking
- Visual status badges
- Loading states during updates

## Mobile App Integration

### Flutter Implementation

```dart
// Update order status
await orderService.updateOrderStatus(orderId, OrderStatus.preparing);

// Get status history
final history = await orderService.getOrderStatusHistory(orderId);
```

### Features

- Offline support with local storage
- API synchronization when online
- Real-time status updates
- Status history viewing

## Database Schema

### MobileOrder Model

```javascript
{
  orderId: String,
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: String,
    notes: String
  }],
  deliveredAt: Date,
  cancelledAt: Date,
  // ... other fields
}
```

## Error Handling

### Common Error Scenarios

1. **Invalid Status Transition**

   ```json
   {
     "message": "Cannot transition from delivered to preparing"
   }
   ```

2. **Invalid Status Value**

   ```json
   {
     "message": "Invalid status. Must be one of: pending, preparing, ready, delivered, cancelled"
   }
   ```

3. **Order Not Found**
   ```json
   {
     "message": "Order not found"
   }
   ```

## Best Practices

### For Cashiers/Staff

1. Always add notes when updating status
2. Follow the status flow sequence
3. Update status promptly when order state changes
4. Use appropriate status for each stage

### For Developers

1. Always validate status transitions
2. Log all status changes for audit trail
3. Handle offline scenarios gracefully
4. Provide clear error messages
5. Implement real-time updates where possible

## Monitoring and Analytics

### Status Tracking Metrics

- Average time in each status
- Status transition patterns
- Order completion rates
- Cancellation rates

### Logging

All status updates are logged with:

- Timestamp
- User who made the change
- Previous and new status
- Notes/Reason for change

## Troubleshooting

### Common Issues

1. **Status not updating**: Check API connectivity and authentication
2. **Invalid transitions**: Verify status flow rules
3. **Sync issues**: Check offline/online state and retry mechanisms

### Debug Commands

```bash
# Check order status
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/mobile-orders/status/orderId

# Get status history
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/mobile-orders/status/orderId/history
```

## Security Considerations

1. **Authentication Required**: All status updates require valid authentication
2. **Authorization**: Only cashiers can update order statuses
3. **Audit Trail**: All changes are logged with user information
4. **Validation**: Server-side validation prevents invalid status changes

## Future Enhancements

1. **Real-time Notifications**: Push notifications for status changes
2. **Automated Status Updates**: Time-based automatic status progression
3. **Status Templates**: Predefined status update templates
4. **Bulk Status Updates**: Update multiple orders at once
5. **Status Analytics Dashboard**: Visual analytics for order flow
