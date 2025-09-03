const axios = require('axios');

class PhilSMSService {
  constructor() {
    this.apiToken = process.env.PHILSMS_API_TOKEN;
    this.senderId = process.env.PHILSMS_SENDER_ID || 'RamenXpress';
    this.baseUrl = process.env.PHILSMS_BASE_URL || 'https://app.philsms.com/api/v3';
    
    if (!this.apiToken) {
      console.log('⚠️  PhilSMS API token not configured. Using mock SMS service.');
    }
  }

  async sendSMS(phoneNumber, message) {
    try {
      // If no API token, use mock service
      if (!this.apiToken) {
        return this.mockSMS(phoneNumber, message);
      }

      // Format phone number for Philippines
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const payload = {
        recipient: formattedPhone,
        message: message,
        sender_id: this.senderId,
        type: 'plain'
      };

      console.log(`📱 Sending SMS via PhilSMS to ${formattedPhone}`);
      
      const response = await axios.post(`${this.baseUrl}/sms/send`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.success) {
        console.log(`✅ SMS sent successfully via PhilSMS: ${response.data.message_id || response.data.id}`);
        return {
          success: true,
          messageId: response.data.message_id || response.data.id,
          message: 'SMS sent successfully'
        };
      } else {
        console.error('❌ PhilSMS API error:', response.data);
        return {
          success: false,
          error: response.data.message || 'Failed to send SMS'
        };
      }

    } catch (error) {
      console.error('❌ PhilSMS service error:', error.message);
      
      // Fallback to mock service on error
      console.log('📱 Falling back to mock SMS service');
      return this.mockSMS(phoneNumber, message);
    }
  }

  async sendOTP(phoneNumber, otpCode, purpose = 'verification') {
    const message = this.generateOTPMessage(otpCode, purpose);
    return await this.sendSMS(phoneNumber, message);
  }

  generateOTPMessage(otpCode, purpose) {
    const messages = {
      verification: `Your RamenXpress verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`,
      registration: `Welcome to RamenXpress! Your verification code is: ${otpCode}. This code expires in 10 minutes.`,
      password_reset: `Your RamenXpress password reset code is: ${otpCode}. This code expires in 10 minutes.`,
      order_update: `Your RamenXpress order update code is: ${otpCode}. This code expires in 10 minutes.`
    };

    return messages[purpose] || messages.verification;
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different Philippine phone number formats
    if (cleaned.startsWith('63')) {
      // Already has country code
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      // Remove leading 0 and add country code
      return '63' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      // Add country code
      return '63' + cleaned;
    } else {
      // Assume it's already formatted correctly
      return cleaned;
    }
  }

  mockSMS(phoneNumber, message) {
    console.log(`📱 Mock SMS to ${phoneNumber}:`);
    console.log(`📱 Message: ${message}`);
    console.log(`📱 [This is a mock SMS - configure PhilSMS API key for real SMS]`);
    
    return {
      success: true,
      messageId: 'mock_' + Date.now(),
      message: 'Mock SMS sent successfully'
    };
  }

  async verifyConnection() {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          message: 'PhilSMS API token not configured',
          service: 'mock'
        };
      }

      // Test API connection with profile request
      const response = await axios.get(`${this.baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Accept': 'application/json'
        },
        timeout: 5000
      });

      if (response.data) {
        console.log('✅ PhilSMS connection verified');
        return {
          success: true,
          message: 'PhilSMS service is working correctly',
          service: 'philsms',
          balance: response.data.balance || 'Unknown',
          profile: response.data
        };
      }

    } catch (error) {
      console.error('❌ PhilSMS connection test failed:', error.message);
      return {
        success: false,
        message: 'PhilSMS service connection failed',
        service: 'mock',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const philsmsService = new PhilSMSService();

module.exports = philsmsService;
