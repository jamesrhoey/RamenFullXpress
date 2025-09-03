# PhilSMS Integration Setup Guide

## 📱 PhilSMS Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# PhilSMS Configuration
PHILSMS_API_TOKEN=your_philsms_api_token_here
PHILSMS_SENDER_ID=RamenXpress
PHILSMS_BASE_URL=https://app.philsms.com/api/v3
```

### Getting PhilSMS API Token

1. **Sign up** at [PhilSMS](https://philsms.com)
2. **Verify your account** and complete KYC requirements
3. **Get your API token** from the dashboard
4. **Add funds** to your account for SMS credits
5. **Update your `.env` file** with the API token

### PhilSMS Features

- ✅ **Philippine phone numbers** - Optimized for local numbers
- ✅ **High delivery rates** - 99%+ delivery success
- ✅ **Affordable pricing** - Competitive rates for local SMS
- ✅ **Real-time delivery** - Instant SMS delivery
- ✅ **Delivery reports** - Track message status
- ✅ **Sender ID** - Custom sender name (RamenXpress)

### Phone Number Format

The service automatically handles Philippine phone number formats:

- `09171234567` → `639171234567`
- `+639171234567` → `639171234567`
- `639171234567` → `639171234567`

### SMS Templates

The service includes pre-built templates for:

- **Registration**: Welcome message with OTP
- **Verification**: Standard verification code
- **Password Reset**: Password reset code
- **Order Updates**: Order status notifications

### Testing

1. **Mock Mode**: Works without API key (logs to console)
2. **Test Mode**: Use test API key for development
3. **Production**: Use live API key for real SMS

### Cost Estimation

- **Registration SMS**: ~₱0.50 per SMS
- **Verification SMS**: ~₱0.50 per SMS
- **Order Updates**: ~₱0.50 per SMS

### Security Features

- ✅ **API Token protection** - Secure API token storage
- ✅ **Bearer token authentication** - Secure API authentication
- ✅ **Rate limiting** - Built-in rate limiting
- ✅ **Error handling** - Graceful fallback to mock
- ✅ **Timeout protection** - 10-second timeout
- ✅ **Phone validation** - Automatic format validation

## 🚀 Quick Start

1. **Add environment variables** to `.env`
2. **Restart your server**
3. **Test SMS sending** with registration
4. **Monitor delivery** in PhilSMS dashboard

## 📡 API Endpoints

### Send SMS
```bash
POST https://app.philsms.com/api/v3/sms/send
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json

{
  "recipient": "639123456789",
  "message": "Your RamenXpress verification code is: 123456",
  "sender_id": "RamenXpress",
  "type": "plain"
}
```

### Get Profile/Balance
```bash
GET https://app.philsms.com/api/v3/profile
Authorization: Bearer YOUR_API_TOKEN
```

### Test SMS Service
```bash
# Test SMS service connection
curl -X GET http://localhost:3000/api/v1/otp/test-sms

# Send test SMS
curl -X POST http://localhost:3000/api/v1/otp/send-test-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "09171234567", "message": "Test SMS from RamenXpress!"}'
```

## 📞 Support

- **PhilSMS Support**: support@philsms.com
- **Documentation**: https://app.philsms.com/developers/documentation
- **API Reference**: https://app.philsms.com/developers/docs
