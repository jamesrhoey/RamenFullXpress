# Mobile App Integration Guide - Phone OTP System

## 📱 Mobile App Flow Overview

The mobile app will follow this user journey:
1. **Registration Screen** → User fills form and submits
2. **Phone OTP Verification Screen** → User enters OTP from SMS
3. **Homepage** → User successfully logged in

---

## 🔄 Complete Mobile App Flow

### Step 1: Registration Screen
**User Action**: Fill registration form and tap "Register"

**API Call**: `POST /api/v1/customers/register`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

**Expected Response** (201):
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

**Mobile App Action**: 
- Show success message
- Navigate to Phone OTP Verification Screen
- Store customer ID and phone number for verification

---

### Step 2: Phone OTP Verification Screen
**User Action**: Enter 6-digit OTP received via SMS and tap "Verify"

**API Call**: `POST /api/v1/customers/verify-phone`

**Request Body**:
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Expected Response** (200):
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

**Mobile App Action**:
- Show success message
- Navigate to Homepage
- Store customer data and verification status

---

### Step 3: Homepage
**User Action**: User is now on the main app screen

**Mobile App Action**:
- Display welcome message with customer name
- Show main app features (menu, orders, profile, etc.)
- Customer is fully authenticated and verified

---

## 🔄 Login Flow (Returning Users)

### Step 1: Login Screen
**User Action**: Enter phone number and password, tap "Login"

**API Call**: `POST /api/v1/customers/login`

**Request Body**:
```json
{
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

**Expected Response** (200):
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

**Mobile App Action**:
- Store JWT token for authenticated requests
- Navigate to Homepage
- Show welcome message

---

## 🚨 Error Handling

### Registration Errors

#### Phone Number Already Exists (400)
```json
{
  "success": false,
  "message": "Phone number already exists"
}
```
**Mobile App Action**: Show error message, allow user to try different phone number

#### SMS Sending Failed (500)
```json
{
  "success": false,
  "message": "Failed to send verification SMS. Please try again.",
  "error": "SMS service error"
}
```
**Mobile App Action**: Show error message, allow user to retry registration

---

### Phone Verification Errors

#### Invalid OTP (400)
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```
**Mobile App Action**: Show error message, allow user to re-enter OTP

#### OTP Expired (400)
```json
{
  "success": false,
  "message": "OTP has expired or exceeded maximum attempts"
}
```
**Mobile App Action**: Show error message, provide "Resend OTP" button

---

### Login Errors

#### Phone Not Verified (403)
```json
{
  "success": false,
  "message": "Please verify your phone number before logging in. Check your SMS for verification code.",
  "requiresPhoneVerification": true,
  "phone": "+1234567890"
}
```
**Mobile App Action**: Navigate to Phone OTP Verification Screen

#### Invalid Credentials (401)
```json
{
  "success": false,
  "message": "Invalid phone number or password"
}
```
**Mobile App Action**: Show error message, allow user to re-enter credentials

---

## 🔄 Resend OTP Flow

### When User Needs New OTP
**User Action**: Tap "Resend OTP" button on verification screen

**API Call**: `POST /api/v1/customers/resend-phone-verification`

**Request Body**:
```json
{
  "phone": "+1234567890"
}
```

**Expected Response** (200):
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

**Mobile App Action**:
- Show success message
- Reset OTP input field
- Start new countdown timer

---

## 📱 Mobile App UI/UX Recommendations

### Registration Screen
- **Form Fields**: First Name, Last Name, Phone Number, Password, Confirm Password
- **Validation**: Real-time validation for phone number format
- **Submit Button**: Disabled until all fields are valid
- **Loading State**: Show spinner during API call

### Phone OTP Verification Screen
- **OTP Input**: 6-digit input field with auto-focus
- **Timer**: Show countdown timer (10 minutes)
- **Resend Button**: Disabled for 60 seconds after each request
- **Back Button**: Allow user to go back to registration if needed

### Login Screen
- **Form Fields**: Phone Number, Password
- **Remember Me**: Optional checkbox for persistent login
- **Forgot Password**: Link to password reset flow
- **Register Link**: Link to registration screen

### Error Handling
- **Toast Messages**: Show success/error messages at bottom of screen
- **Field Validation**: Highlight invalid fields with red border
- **Retry Logic**: Provide clear retry options for failed operations

---

## 🔐 Security Considerations

### JWT Token Management
- **Storage**: Store JWT token securely (Keychain on iOS, Keystore on Android)
- **Expiration**: Handle token expiration gracefully
- **Refresh**: Implement token refresh logic if needed

### Phone Number Validation
- **Format**: Validate phone number format before sending to API
- **International**: Support international phone number formats
- **Masking**: Mask phone number in UI for privacy

### OTP Security
- **Auto-fill**: Support SMS auto-fill for OTP input
- **Copy Protection**: Prevent OTP from being copied to clipboard
- **Screen Recording**: Warn users about screen recording during OTP entry

---

## 🧪 Testing Scenarios

### Happy Path Testing
1. ✅ Successful registration with valid phone number
2. ✅ Successful phone verification with correct OTP
3. ✅ Successful login with verified account
4. ✅ Successful resend OTP functionality

### Error Path Testing
1. ❌ Registration with existing phone number
2. ❌ Phone verification with invalid OTP
3. ❌ Phone verification with expired OTP
4. ❌ Login with unverified phone number
5. ❌ Login with invalid credentials
6. ❌ Network connectivity issues

### Edge Cases
1. 🔄 Multiple rapid OTP requests (rate limiting)
2. 🔄 App backgrounding during verification
3. 🔄 Phone number format variations
4. 🔄 SMS delivery delays
5. 🔄 App restart during verification flow

---

## 📊 Analytics & Monitoring

### Key Metrics to Track
- **Registration Completion Rate**: % of users who complete registration
- **Phone Verification Success Rate**: % of users who verify phone successfully
- **Login Success Rate**: % of successful logins
- **OTP Resend Rate**: % of users who need to resend OTP
- **Time to Verification**: Average time from registration to verification

### Error Monitoring
- **API Error Rates**: Monitor 4xx and 5xx response rates
- **SMS Delivery Failures**: Track SMS service failures
- **Network Timeouts**: Monitor network connectivity issues
- **User Abandonment**: Track where users drop off in the flow

---

## 🚀 Implementation Checklist

### Backend Integration
- [ ] Configure PhilSMS API credentials
- [ ] Test SMS sending functionality
- [ ] Implement proper error handling
- [ ] Set up rate limiting
- [ ] Configure CORS for mobile app

### Mobile App Development
- [ ] Implement registration screen
- [ ] Implement phone OTP verification screen
- [ ] Implement login screen
- [ ] Add JWT token management
- [ ] Implement error handling and retry logic
- [ ] Add loading states and animations
- [ ] Test on different devices and OS versions

### Testing & QA
- [ ] Test with real phone numbers
- [ ] Test SMS delivery in different regions
- [ ] Test network connectivity scenarios
- [ ] Test app backgrounding/foregrounding
- [ ] Test with different phone number formats
- [ ] Performance testing with high user load

---

## 📞 Support & Troubleshooting

### Common Issues
1. **SMS Not Received**: Check phone number format, carrier restrictions
2. **OTP Expired**: Implement resend functionality
3. **Network Errors**: Implement retry logic with exponential backoff
4. **Token Expired**: Implement token refresh or re-login flow

### Debug Information
- **API Response Codes**: Log all API responses for debugging
- **Network Status**: Monitor network connectivity
- **SMS Delivery Status**: Track SMS delivery success/failure
- **User Actions**: Log user interactions for flow analysis

---

## 🔗 Related Documentation

- [Phone OTP API Documentation](./PHONE_OTP_API_DOCUMENTATION.md)
- [PhilSMS Setup Guide](./PHILSMS_SETUP.md)
- [Customer Model Schema](../models/customer.js)
- [OTP Model Schema](../models/otp.js)