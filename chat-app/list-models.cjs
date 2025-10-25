// List available models from Google AI API
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY not found in .env.local');
    return;
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('\n📋 Fetching available models...');
    
    // Use the REST API directly to list models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('\n✅ Available models:');
    data.models.forEach(model => {
      const supportedMethods = model.supportedGenerationMethods || [];
      console.log(`\n📦 ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Supported Methods: ${supportedMethods.join(', ')}`);
      
      // Extract just the model ID for use in the app
      const modelId = model.name.replace('models/', '');
      if (supportedMethods.includes('generateContent')) {
        console.log(`   ✅ Use this ID: "${modelId}"`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
  }
}

listModels();