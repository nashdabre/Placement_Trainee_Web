/**
 * Simple test to verify storage functionality
 * This can be run in the browser console to debug storage issues
 */

// Test the storage utility
const testStorageFunction = () => {
  console.log('=== Storage Test Started ===');
  
  // Test storage availability
  console.log('Storage available:', typeof Storage !== "undefined" && window.localStorage);
  
  // Test basic localStorage operations
  try {
    localStorage.setItem('test_key', 'test_value');
    const retrievedValue = localStorage.getItem('test_key');
    console.log('Basic localStorage test:', retrievedValue === 'test_value' ? 'PASS' : 'FAIL');
    localStorage.removeItem('test_key');
  } catch (e) {
    console.error('Basic localStorage test FAILED:', e);
  }
  
  // Test JSON operations
  try {
    const testData = { id: 1, name: 'Test Plan', createdAt: new Date().toISOString() };
    localStorage.setItem('test_json', JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem('test_json'));
    console.log('JSON localStorage test:', retrieved.id === 1 ? 'PASS' : 'FAIL');
    localStorage.removeItem('test_json');
  } catch (e) {
    console.error('JSON localStorage test FAILED:', e);
  }
  
  // Check current career plans
  const existingPlans = localStorage.getItem('career_plan_data');
  console.log('Existing career plans raw:', existingPlans);
  
  if (existingPlans) {
    try {
      const parsed = JSON.parse(existingPlans);
      console.log('Existing career plans parsed:', parsed);
      console.log('Number of plans:', Array.isArray(parsed) ? parsed.length : 'Not an array');
    } catch (e) {
      console.error('Error parsing existing plans:', e);
    }
  }
  
  console.log('=== Storage Test Completed ===');
};

// Export for console use
window.testStorage = testStorageFunction;

// Auto-run if in development
if (window.location.hostname === 'localhost') {
  console.log('Development environment detected. Run testStorage() in console to test storage.');
}
