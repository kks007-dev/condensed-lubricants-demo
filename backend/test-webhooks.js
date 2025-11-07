#!/usr/bin/env node

/**
 * Test script to simulate voice agent webhook calls
 * Run this after starting the backend server to test real-time updates
 */

const BASE_URL = 'http://localhost:3001';

// Helper function to make HTTP requests
async function makeRequest(endpoint, data = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log(`✅ ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ ${endpoint}:`, error.message);
  }
}

// Test sequence that simulates a voice agent workflow
async function runDemoSequence() {
  console.log('🚀 Starting voice agent demo sequence...\n');
  
  // Wait between steps to see the progression
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
  // Step 1: Freight setup (condensed flow)
  console.log('🚛 Voice Agent: "Now I\'ll set up the freight forwarding..."');
  await makeRequest('/webhook/call-freighter');
  await delay(2000);

  // Step 2: Confirmation
  console.log('📞 Voice Agent: "Pickup has been confirmed..."');
  await makeRequest('/webhook/confirm-pickup');
  await delay(2000);

  // Step 3: Contingency planning
  console.log('🔄 Voice Agent: "Setting up backup options..."');
  await makeRequest('/webhook/set-backups');
  await delay(2000);

  // Step 4: Final confirmation
  console.log('📧 Voice Agent: "Sending final confirmation email..."');
  await makeRequest('/webhook/send-email');
    
    console.log('\n🎉 Demo sequence completed!');
    
  } catch (error) {
    console.error('❌ Demo sequence failed:', error);
  }
}

// Test individual webhook endpoints
async function testIndividualEndpoints() {
  console.log('🧪 Testing individual webhook endpoints...\n');
  
  const endpoints = [
    '/webhook/call-freighter',
    '/webhook/confirm-pickup',
    '/webhook/set-backups',
    '/webhook/send-email'
  ];
  
  for (const endpoint of endpoints) {
    await makeRequest(endpoint);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test generic demo step endpoint
async function testGenericEndpoint() {
  console.log('🔧 Testing generic demo step endpoint...\n');
  
  const steps = [
    'initial',
    'freight-setup',
    'confirmation',
    'contingency',
    'final-confirmation'
  ];
  
  for (const step of steps) {
    await makeRequest('/webhook/demo-step', { step });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'demo';
  
  console.log('🎯 Voice Agent Webhook Tester');
  console.log('=============================\n');
  
  // Check if server is running
  try {
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log('✅ Backend server is running:', health);
    console.log('');
  } catch (error) {
    console.error('❌ Backend server is not running. Please start it first:');
    console.error('   cd backend && npm install && npm start');
    process.exit(1);
  }
  
  switch (command) {
    case 'demo':
      await runDemoSequence();
      break;
    case 'individual':
      await testIndividualEndpoints();
      break;
    case 'generic':
      await testGenericEndpoint();
      break;
    default:
      console.log('Usage: node test-webhooks.js [demo|individual|generic]');
      console.log('  demo       - Run full demo sequence (default)');
      console.log('  individual - Test individual webhook endpoints');
      console.log('  generic    - Test generic demo-step endpoint');
  }
}

main().catch(console.error);
