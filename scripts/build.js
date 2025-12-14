#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building Claude Code Router...');

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Build the main CLI application
  console.log('Building CLI application...');
  execSync('npx esbuild src/cli.ts --bundle --platform=node --outfile=dist/cli.js', { stdio: 'inherit' });
  
  // Copy the tiktoken WASM file
  console.log('Copying tiktoken WASM file...');
  const tiktokenSrc = path.join('node_modules', 'tiktoken', 'tiktoken_bg.wasm');
  if (fs.existsSync(tiktokenSrc)) {
    copyFile(tiktokenSrc, 'dist/tiktoken_bg.wasm');
  } else {
    console.warn('Warning: tiktoken_bg.wasm not found at', tiktokenSrc);
  }
  
  // Build the UI
  // Check if node_modules exists in ui directory, if not install dependencies
  const uiDir = path.resolve('ui');
  if (fs.existsSync(uiDir)) {
    if (!fs.existsSync(path.join(uiDir, 'node_modules'))) {
      console.log('Installing UI dependencies...');
      execSync('npm install', { cwd: uiDir, stdio: 'inherit' });
    }
    console.log('Building UI...');
    execSync('npm run build', { cwd: uiDir, stdio: 'inherit' });
    
    // Copy the built UI index.html to dist
    console.log('Copying UI build artifacts...');
    const uiIndexSrc = path.join(uiDir, 'dist', 'index.html');
    if (fs.existsSync(uiIndexSrc)) {
      copyFile(uiIndexSrc, 'dist/index.html');
    } else {
      console.warn('Warning: UI build artifact index.html not found');
    }
  } else {
    console.warn('Warning: UI directory not found');
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}