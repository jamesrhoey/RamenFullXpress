# Phone OTP System - API Documentation

## Overview
This documentation covers the Phone OTP (One-Time Password) system for customer registration and phone verification in the Ramen Backend API.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
- **Customer Registration**: No authentication required (but requires phone verification after registration)
- **Customer Login**: Requires phone verification to be completed during registration
- **OTP Operations**: No authentication required

---

## 📱 OTP Endpoints

### 1. Generate OTP
**POST** `/otp/generate`

Generates and sends an OTP code to the specified phone number.

#### Request Body
```json
{
  "phone": "+1234567890",
  "purpose": "phone_verification"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "+1234567890",
    "purpose": "phone_verification",
    "expiresIn": "10 minutes"
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Invalid phone number format"
}
```

---

### 2. Verify OTP
**POST** `/otp/verify`

Verifies the OTP code sent to the phone number.

#### Request Body
```json
{
  "phone": "+1234567890",
  "otp": "123456",
  "purpose": "phone_verification"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "phone": "+1234567890",
    "purpose": "phone_verification",
    "verified": true
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 3. Test SMS Service
**GET** `/otp/test-sms`

Tests the SMS service connection and configuration.

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "SMS service is working correctly",
  "data": {
    "service": "PhilSMS",
    "configured": true,
    "balance": "100.00"
  }
}
```

#### Response (Error - 500)
```json
{
  "success": false,
  "message": "SMS service configuration error"
}
```

---

### 4. Send Test SMS
**POST** `/otp/send-test-sms`

Sends a test SMS message to verify the SMS service.

#### Request Body
```json
{
  "phone": "+1234567890",
  "message": "Test SMS from RamenXpress!"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Test SMS sent successfully",
  "data": {
    "phone": "+1234567890",
    "messageId": "msg_123456789",
    "message": "Test SMS from RamenXpress!"
  }
}
```

---

## 👤 Customer Endpoints

### 1. Customer Registration
**POST** `/customers/register`

Registers a new customer and sends phone verification OTP.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "message": "Customer registered successfully. Please check your SMS to verify your phone number.",
  "data": {
    "customer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isPhoneVerified": false
    },
    "verificationSMSSent": true
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Phone number already exists"
}
```

---

### 2. Customer Login
**POST** `/customers/login`

Authenticates a customer using phone number and password.

#### Request Body
```json
{
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "customer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isPhoneVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Response (Error - 403 - Phone Not Verified)
```json
{
  "success": false,
  "message": "Please verify your phone number before logging in. Check your SMS for verification code.",
  "requiresPhoneVerification": true,
  "phone": "+1234567890"
}
```

#### Response (Error - 401 - Invalid Credentials)
```json
{
  "success": false,
  "message": "Invalid phone number or password"
}
```

---

### 3. Verify Phone Number
**POST** `/customers/verify-phone`

Verifies the customer's phone number using the OTP sent during registration.

#### Request Body
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "data": {
    "customer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isPhoneVerified": true
    }
  }
}
```

#### Response (Error - 400)
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 4. Resend Phone Verification
**POST** `/customers/resend-phone-verification`

Resends the phone verification OTP to the customer's phone number.

#### Request Body
```json
{
  "phone": "+1234567890"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Phone verification code sent successfully. Please check your SMS.",
  "data": {
    "phone": "+1234567890",
    "expiresIn": "10 minutes"
  }
}
```

#### Response (Error - 429 - Rate Limited)
```json
{
  "success": false,
  "message": "Please wait before requesting another verification code"
}
```

---

## 🔐 Protected Customer Endpoints

*Note: These endpoints require authentication via JWT token in the Authorization header.*

### 1. Get Customer Profile
**GET** `/customers/profile`

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "isPhoneVerified": true,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  }
}
```

---

### 2. Update Customer Profile
**PUT** `/customers/profile`

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "customer": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+1234567890",
      "isPhoneVerified": true
    }
  }
}
```

---

### 3. Change Password
**PUT** `/customers/change-password`

#### Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📱 SMS Service Configuration

### PhilSMS Integration
The system uses PhilSMS for sending real SMS messages. Configure the following environment variables:

```env
PHILSMS_API_TOKEN=your_philsms_api_token_here
PHILSMS_SENDER_ID=RamenXpress
PHILSMS_BASE_URL=https://app.philsms.com/api/v3
```

### Mock SMS Service
If PhilSMS is not configured, the system will use a mock SMS service that logs messages to the console for development purposes.

---

## 🔄 Complete Registration Flow

### Step 1: Register Customer
```bash
curl -X POST http://localhost:3000/api/v1/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "password": "securepassword123"
  }'
```

### Step 2: Verify Phone Number
```bash
curl -X POST http://localhost:3000/api/v1/customers/verify-phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "otp": "123456"
  }'
```

### Step 3: Login
```bash
curl -X POST http://localhost:3000/api/v1/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "password": "securepassword123"
  }'
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Phone not verified |
| 404 | Not Found - Customer not found |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error - Server error |

---

## 📝 Notes

- **Phone Verification Required**: Customers must verify their phone number before they can log in
- **OTP Expiration**: OTP codes expire after 10 minutes
- **Rate Limiting**: OTP requests are rate limited to prevent abuse
- **Mock SMS**: In development, SMS messages are logged to console if PhilSMS is not configured
- **Security**: All passwords are hashed using bcrypt before storage
