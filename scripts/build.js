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

function findEsbuildBin() {
    const localBin = path.join(process.cwd(), 'node_modules', '.bin', 'esbuild');
    if (fs.existsSync(localBin)) return localBin;
    
    // Check if it's in the path (global)
    try {
        execSync('command -v esbuild');
        return 'esbuild';
    } catch (e) {
        return null;
    }
}

try {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Build the main CLI application
  console.log('Building CLI application...');
  
  let esbuildBin = findEsbuildBin();
  
  if (!esbuildBin) {
      console.log('esbuild binary not found, installing it locally...');
      try {
          execSync('npm install esbuild --no-save', { stdio: 'inherit' });
          esbuildBin = path.join(process.cwd(), 'node_modules', '.bin', 'esbuild');
      } catch (e) {
          console.error('Failed to install esbuild:', e.message);
          process.exit(1);
      }
  }

  console.log(`Using esbuild at: ${esbuildBin}`);
  execSync(`${esbuildBin} src/cli.ts --bundle --platform=node --outfile=dist/cli.js`, { stdio: 'inherit' });
  
  // Copy the tiktoken WASM file
  console.log('Copying tiktoken WASM file...');
  let tiktokenSrc = path.join(process.cwd(), 'node_modules', 'tiktoken', 'tiktoken_bg.wasm');
  
  if (!fs.existsSync(tiktokenSrc)) {
      try {
          tiktokenSrc = require.resolve('tiktoken/tiktoken_bg.wasm');
      } catch (e) {
          // tiktoken might be missing too
          console.log('tiktoken not found, ensuring dependencies...');
          try {
             execSync('npm install tiktoken --no-save', { stdio: 'inherit' });
             tiktokenSrc = path.join(process.cwd(), 'node_modules', 'tiktoken', 'tiktoken_bg.wasm');
          } catch(e) {
             console.warn('Could not install tiktoken, skipping copy.');
          }
      }
  }

  if (fs.existsSync(tiktokenSrc)) {
    copyFile(tiktokenSrc, 'dist/tiktoken_bg.wasm');
  } else {
    console.warn('Warning: tiktoken_bg.wasm not found.');
  }
  
  // Build the UI
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