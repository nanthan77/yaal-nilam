/**
 * AI Bridge Service
 * Routes payloads from Node.js gateway to Python AI microservice
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000';

/**
 * Send a processed message to the Python AI service for intent extraction
 */
async function sendToAIService(payload) {
  try {
    // If voice note, send audio file as multipart
    if (payload.message.type === 'voice' && payload.message.audioPath) {
      const form = new FormData();
      form.append('audio', fs.createReadStream(payload.message.audioPath));
      form.append('phone', payload.phone);
      form.append('session', JSON.stringify(payload.session));

      const response = await axios.post(
        `${AI_SERVICE_URL}/api/process-voice`,
        form,
        { headers: form.getHeaders(), timeout: 30000 }
      );
      return response.data;
    }

    // Text message — send as JSON
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/process-message`,
      payload,
      { timeout: 15000 }
    );

    return response.data;
  } catch (error) {
    console.error('AI Service error:', error.message);

    // MOCK FALLBACK: Return a basic mock response for development
    if (process.env.NODE_ENV === 'development' || !AI_SERVICE_URL.includes('localhost')) {
      console.log('🔧 MOCK AI — Returning fallback response');
      return generateMockResponse(payload);
    }

    return {
      reply: 'Sorry, I\'m having a small issue processing that right now. Please try again in a moment. / மன்னிக்கவும், இதை இப்போது செயலாக்க சிறிய சிக்கல் உள்ளது. ஒரு நிமிடத்தில் மீண்டும் முயற்சிக்கவும்.',
      intent: 'error',
      confidence: 0
    };
  }
}

/**
 * Mock AI response for development without Python service
 */
function generateMockResponse(payload) {
  const text = (payload.message.text || payload.message.raw || '').toLowerCase();

  // Simple keyword-based intent detection for mock mode
  if (text.includes('buy') || text.includes('venum') || text.includes('looking') || text.includes('want')) {
    return {
      reply: '🏠 I can help you look for a property to buy.\nPlease tell me:\n1. Which area in Jaffna do you prefer?\n2. What is your budget range?\n3. How many bedrooms do you need?\n\n🏠 வாங்க ஒரு சொத்து தேட உதவுகிறேன்.\nதயவுசெய்து சொல்லுங்கள்:\n1. யாழ்ப்பாணத்தில் எந்த பகுதி வேண்டும்?\n2. உங்கள் பட்ஜெட் வரம்பு என்ன?\n3. எத்தனை படுக்கையறைகள் வேண்டும்?',
      intent: 'buy_requirement',
      confidence: 0.85,
      session_update: {
        current_flow: 'buyer_requirement',
        pending_fields: ['location', 'budget', 'bedrooms']
      }
    };
  }

  if (text.includes('sell') || text.includes('sale') || text.includes('list') || text.includes('post')) {
    return {
      reply: '📝 I can help you list your property.\nPlease share:\n1. Property photos\n2. Property type and location\n3. Asking price\n\nYou can send everything together or step by step.\n\n📝 உங்கள் சொத்தைப் பட்டியலிட உதவுகிறேன்.\nதயவுசெய்து அனுப்புங்கள்:\n1. சொத்து புகைப்படங்கள்\n2. சொத்து வகை மற்றும் இடம்\n3. கேட்கும் விலை\n\nஅனைத்தையும் ஒரே செய்தியிலோ, படிப்படியாகவோ அனுப்பலாம்.',
      intent: 'listing_creation',
      confidence: 0.82,
      session_update: {
        current_flow: 'listing_creation',
        pending_fields: ['property_type', 'location', 'price', 'images']
      }
    };
  }

  if (text.includes('rent') || text.includes('lease') || text.includes('vaadagai')) {
    return {
      reply: '🏘️ I can help you find a rental property.\nPlease tell me:\n1. Which area do you prefer?\n2. What is your monthly budget?\n3. How many bedrooms or rooms do you need?\n\n🏘️ வாடகைக்கு ஒரு சொத்து தேட உதவுகிறேன்.\nதயவுசெய்து சொல்லுங்கள்:\n1. எந்த பகுதி வேண்டும்?\n2. மாதாந்திர பட்ஜெட் என்ன?\n3. எத்தனை அறைகள் அல்லது படுக்கையறைகள் வேண்டும்?',
      intent: 'rent_requirement',
      confidence: 0.80,
      session_update: {
        current_flow: 'buyer_requirement',
        flow_state: { intent: 'rent' },
        pending_fields: ['location', 'budget', 'bedrooms']
      }
    };
  }

  // Default greeting
  return {
    reply: '🏠 Welcome to Yaal Nilam.\nI can help you buy, rent, or list property in Jaffna.\nJust tell me what you need.\n\n🏠 யாழ் நிலத்திற்கு வரவேற்கிறோம்.\nயாழ்ப்பாணத்தில் வாங்க, வாடகைக்கு எடுக்க, அல்லது சொத்தைப் பட்டியலிட உதவுகிறோம்.\nஉங்களுக்கு என்ன தேவை என்று சொல்லுங்கள்.',
    intent: 'greeting',
    confidence: 0.95,
    session_update: {
      current_flow: 'general'
    }
  };
}

module.exports = { sendToAIService };
