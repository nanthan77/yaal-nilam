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
      reply: 'Sorry, I\'m having trouble understanding right now. Please try again. / மன்னிக்கவும், இப்போது புரிந்துகொள்வதில் சிக்கல். மீண்டும் முயற்சிக்கவும்.',
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
      reply: '🏠 Got it! I understand you\'re looking to buy a property. Could you tell me:\n1. Which area in Jaffna? (எந்த பகுதி?)\n2. Your budget? (உங்கள் பட்ஜெட்?)\n3. How many bedrooms? (எத்தனை அறைகள்?)',
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
      reply: '📝 You want to list a property! Please share:\n1. Property photos (சொத்து படங்கள்)\n2. Location & type (இடம் & வகை)\n3. Asking price (விலை)\n\nYou can send everything in one message or step by step.',
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
      reply: '🏘️ Looking for a rental property! Tell me:\n1. Area preference? (எந்த பகுதி?)\n2. Monthly budget? (மாத வாடகை?)\n3. Rooms needed? (எத்தனை அறைகள்?)',
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
    reply: '🏠 Welcome to Yaal Nilam! / யாழ் நிலத்திற்கு வருக!\n\nI can help you:\n• 🔍 Find a property to buy or rent\n• 📝 List your property for sale\n• 📊 Get property market info\n\nWhat would you like to do? / நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?',
    intent: 'greeting',
    confidence: 0.95,
    session_update: {
      current_flow: 'general'
    }
  };
}

module.exports = { sendToAIService };
