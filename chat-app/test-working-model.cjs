// Test the working Gemini 2.0 Flash model
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testWorkingModel() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY not found in .env.local');
    return;
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('\n🧪 Testing Gemini 2.0 Flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Hello! Please respond with "AI is working perfectly!" so I know you are functioning correctly.');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ Response: ${text.trim()}`);
    
    console.log('\n🧪 Testing streaming...');
    const streamResult = await model.generateContentStream('Count from 1 to 5, putting each number on a new line.');
    
    console.log('🌊 Streaming response:');
    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
    console.log('\n✅ Streaming test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWorkingModel();