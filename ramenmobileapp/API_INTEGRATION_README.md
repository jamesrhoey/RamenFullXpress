# API Integration Setup Guide

This guide will help you connect the Flutter mobile app to the backend API.

## Prerequisites

1. **Backend Server**: Make sure the backend server is running
2. **MongoDB**: Ensure MongoDB is running locally
3. **Flutter**: Make sure Flutter is installed and configured

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/ramenxpressApp
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 3. Start the Backend Server
```bash
cd backend
npm start
```

The server should start on `http://localhost:3000`

## Flutter App Setup

### 1. Install Dependencies
```bash
cd ramenmobileapp
flutter pub get
```

### 2. API Configuration

The API service is configured to connect to the backend. The base URL is set to:
- **Android Emulator**: `http://10.0.2.2:3000/api/v1`
- **iOS Simulator**: `http://localhost:3000/api/v1`
- **Physical Device**: Update to your computer's IP address

### 3. Test API Connection

You can test the API connection by running:
```dart
import 'test_api_connection.dart';

// In your main.dart or a test file
await ApiConnectionTest.testConnection();
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Menu
- `GET /api/v1/menu/all` - Get all menu items
- `GET /api/v1/menu/category/:category` - Get menu items by category
- `GET /api/v1/menu/:id` - Get specific menu item

### Mobile Orders
- `POST /api/v1/mobile-orders` - Create new order
- `GET /api/v1/mobile-orders/all` - Get all orders
- `GET /api/v1/mobile-orders/:id` - Get specific order
- `PUT /api/v1/mobile-orders/update/:id` - Update order

### Payment Methods
- `GET /api/v1/payment-methods/all` - Get all payment methods
- `POST /api/v1/payment-methods` - Create payment method
- `PUT /api/v1/payment-methods/update/:id` - Update payment method
- `DELETE /api/v1/payment-methods/delete/:id` - Delete payment method

### Delivery Addresses
- `GET /api/v1/delivery-addresses/all` - Get all addresses
- `POST /api/v1/delivery-addresses` - Create address
- `PUT /api/v1/delivery-addresses/update/:id` - Update address
- `DELETE /api/v1/delivery-addresses/delete/:id` - Delete address

## Features Implemented

### ✅ Completed
1. **API Service**: Complete HTTP client with error handling
2. **Authentication**: JWT-based login/logout
3. **Menu Integration**: Fetch menu items from API with fallback
4. **Order Management**: Create and manage orders via API
5. **Offline Support**: Local storage fallback when API is unavailable
6. **Error Handling**: Comprehensive error handling and user feedback

### 🔄 In Progress
1. **Real-time Updates**: WebSocket integration for order status
2. **Push Notifications**: Order status notifications
3. **Image Upload**: Menu item image management

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure backend server is running on port 3000
   - Check if MongoDB is running
   - Verify firewall settings

2. **CORS Errors**
   - Backend CORS is configured for common origins
   - For physical devices, update CORS origins in backend

3. **Authentication Errors**
   - Check JWT_SECRET in backend .env file
   - Verify token storage in SharedPreferences

4. **API Endpoint Not Found**
   - Ensure all routes are properly configured in backend
   - Check API versioning (/api/v1/)

### Testing

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **API Endpoints**:
   ```bash
   curl http://localhost:3000/api/v1/menu/all
   ```

3. **Flutter App**:
   - Run the app and check console logs
   - Use the test connection function

## Development Notes

### API Service Features
- **Singleton Pattern**: Single instance across the app
- **Token Management**: Automatic JWT token handling
- **Error Handling**: User-friendly error messages
- **Offline Support**: Local storage fallback
- **Request Interceptors**: Automatic authentication headers

### Security Considerations
- JWT tokens are stored securely in SharedPreferences
- HTTPS should be used in production
- Input validation on both client and server
- Rate limiting should be implemented

### Performance Optimizations
- Request caching for menu items
- Lazy loading for large datasets
- Image caching for menu items
- Offline-first approach with sync

## Next Steps

1. **Add Real-time Features**: WebSocket integration
2. **Implement Push Notifications**: Order status updates
3. **Add Image Upload**: Menu item management
4. **Enhance Security**: HTTPS, rate limiting
5. **Add Analytics**: User behavior tracking
6. **Performance Monitoring**: API response times

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify network connectivity
3. Test API endpoints directly
4. Review the troubleshooting section above 