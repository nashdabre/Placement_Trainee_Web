import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Shared model options to avoid duplication
const MODEL_OPTIONS = [
  { model: 'gemini-1.5-flash-latest' },
  { model: 'gemini-1.5-flash' },
  { model: 'gemini-1.5-pro' },
  { model: 'gemini-pro' },
  { model: 'models/gemini-1.5-flash' },
  { model: 'models/gemini-pro' }
];

// Simple function to generate career plan
const generateCareerPlan = async (role, timeframe, planType = 'monthly') => {
  console.log('=== Starting Career Plan Generation ===');
  console.log('Role:', role);
  console.log('Timeframe:', timeframe);
  console.log('Plan Type:', planType);
  console.log('API Key exists:', !!API_KEY);
  
  if (!API_KEY) {
    console.error('API key is missing');
    throw new Error('API key is missing. Please add your API key to environment variables.');
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Use shared model options
    let model = null;
    let modelUsed = '';
    
    for (const option of MODEL_OPTIONS) {
      try {
        console.log(`Trying model: ${option.model}`);
        model = genAI.getGenerativeModel(option);
        
        // Test the model with a simple request first
        await model.generateContent('test');
        
        modelUsed = option.model;
        console.log(`✅ Model ${option.model} is working`);
        break;
      } catch (modelError) {
        console.log(`❌ Model ${option.model} failed:`, modelError.message);
        continue;
      }
    }
    
    if (!model) {
      throw new Error('No compatible  model found. The API might be experiencing issues.');
    }
    
    console.log(`Using model: ${modelUsed}`);
    
    const timeUnit = planType === 'weekly' ? 'week' : 'month';
    
    // Simplified prompt for better success rate
    const prompt = `Create a ${timeframe}-${timeUnit} career plan for becoming a ${role}. 

Return ONLY a JSON array like this:
[
  {
    "${timeUnit}": 1,
    "title": "Foundation Skills",
    "description": "Learn the basics of ${role} including fundamental concepts and tools. Spend 2-3 hours daily studying core principles and practicing with simple exercises.",
    "skills": ["Basic skill 1", "Basic skill 2", "Basic skill 3"],
    "projects": ["Simple project 1", "Practice exercise"],
    "resources": ["Online course", "Documentation", "Tutorial"],
    "milestone": "Complete basic understanding"
  },
  {
    "${timeUnit}": 2,
    "title": "Intermediate Development",
    "description": "Build upon foundation with more complex topics and practical projects. Focus on hands-on experience with real-world applications.",
    "skills": ["Intermediate skill 1", "Intermediate skill 2"],
    "projects": ["Intermediate project"],
    "resources": ["Advanced course", "Practice platform"],
    "milestone": "Build working project"
  }
]

Generate exactly ${timeframe} items. Return ONLY the JSON array, no other text.`;

    console.log('Sending request to api...');
    console.log('Prompt length:', prompt.length);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    console.log('Raw api response:', text);
    
    // Clean the response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Find JSON array
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.substring(jsonStart, jsonEnd);
    }
    
    console.log('Cleaned JSON:', text);
    
    try {
      const parsedPlan = JSON.parse(text);
      console.log('Parsed plan:', parsedPlan);
      
      if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
        console.log('Plan validation successful');
        return parsedPlan;
      } else {
        throw new Error('Invalid plan structure');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Text that failed to parse:', text);
      throw new Error('Failed to parse AI response. Please try again.');
    }
    
  } catch (error) {
    console.error('=== Career Plan Generation Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Handle specific Google AI errors
    if (error.message && error.message.includes('model is not found')) {
      throw new Error(' API model not available. Please check your API key permissions or try again later.');
    } else if (error.message && error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message && error.message.includes('403')) {
      throw new Error('API access forbidden. Please check your  API key and billing settings.');
    } else if (error.message && error.message.includes('404')) {
      throw new Error(' API endpoint not found. Please check your API configuration.');
    } else if (error.message && error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to generate career plan: ${error.message || 'Unknown error'}`);
    }
  }
};

// Test function for debugging
const testGeminiConnection = async () => {
  console.log('Testing Gemini connection...');
  console.log('API Key exists:', !!API_KEY);
  console.log('API Key preview:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'Missing');
  
  if (!API_KEY) {
    throw new Error('Gemini API key is missing');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Use shared model options
    for (const option of MODEL_OPTIONS) {
      try {
        console.log(`Testing model: ${option.model}`);
        const model = genAI.getGenerativeModel(option);
        const result = await model.generateContent('Hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ Success with model: ${option.model}`, text);
        return { model: option.model, response: text };
      } catch (error) {
        console.log(`❌ Failed with model: ${option.model}`, error.message);
        continue;
      }
    }
    
    throw new Error('All model variants failed');
  } catch (error) {
    console.error('Gemini test failed:', error);
    throw error;
  }
};

// Export the functions
export { generateCareerPlan, testGeminiConnection };
