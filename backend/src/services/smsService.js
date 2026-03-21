// Simulated Sparrow SMS Integration
exports.sendSMS = async (phoneNumber, message) => {
  try {
    // In production, this would be an actual Axios POST request to Sparrow SMS or Twilio:
    // await axios.post('http://api.sparrowsms.com/v2/sms/', { token: 'YOUR_KEY', from: 'LocalAid', to: phoneNumber, text: message });

    console.log('\n=========================================');
    console.log(`[SMS GATEWAY SIMULATION]`);
    console.log(`TO: ${phoneNumber}`);
    console.log(`MESSAGE: ${message}`);
    console.log('STATUS: Delivered Successfully');
    console.log('=========================================\n');
    
    return true;
  } catch (error) {
    console.error('SMS Gateway Error:', error.message);
    return false;
  }
};