#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Run the main MCP server
const server = spawn('node', [path.join(__dirname, '..', 'dist', 'index.js')], {
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start GuardBot:', err.message);
  process.exit(1);
});

process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
