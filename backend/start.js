#!/usr/bin/env node

// Simple startup script for production
import('./dist/server.js')
  .then(() => {
    console.log('Server module loaded successfully');
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
