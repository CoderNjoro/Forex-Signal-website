#!/usr/bin/env node

/**
 * Quick test script to verify backend changes compile correctly
 */

console.log('Testing backend changes...\n');

try {
  // Test Signal model
  console.log('✓ Testing Signal model...');
  const Signal = require('./src/models/Signal');
  console.log('  ✓ Signal model loaded successfully');
  
  // Test signal controller
  console.log('✓ Testing Signal controller...');
  const signalController = require('./src/controllers/signalController');
  console.log('  ✓ Signal controller loaded successfully');
  console.log('  ✓ New methods available:');
  console.log('    - updateTPHit:', typeof signalController.updateTPHit === 'function' ? '✓' : '✗');
  console.log('    - markSLHit:', typeof signalController.markSLHit === 'function' ? '✓' : '✗');
  console.log('    - markBreakeven:', typeof signalController.markBreakeven === 'function' ? '✓' : '✗');
  console.log('    - closeSignal:', typeof signalController.closeSignal === 'function' ? '✓' : '✗');
  
  // Test routes
  console.log('✓ Testing Signal routes...');
  const signalRoutes = require('./src/routes/signal.routes');
  console.log('  ✓ Signal routes loaded successfully');
  
  console.log('\n✅ All backend changes compiled successfully!');
  console.log('\nYou can now start the backend server with: npm start');
  
} catch (error) {
  console.error('\n❌ Error testing backend changes:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
