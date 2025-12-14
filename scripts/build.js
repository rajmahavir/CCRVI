#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure we are in the project root
process.chdir(path.join(__dirname, '..'));

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
  
  // Use esbuild API directly since it's a dependency
  const esbuild = require('esbuild');
  esbuild.buildSync({
    entryPoints: ['src/cli.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/cli.js',
    packages: 'external', // Don't bundle dependencies
  });
  
  // Copy the tiktoken WASM file
  console.log('Copying tiktoken WASM file...');
  let tiktokenSrc;
  try {
    tiktokenSrc = require.resolve('tiktoken/tiktoken_bg.wasm');
  } catch (e) {
    // Fallback path check
    tiktokenSrc = path.join(process.cwd(), 'node_modules', 'tiktoken', 'tiktoken_bg.wasm');
  }

  if (tiktokenSrc && fs.existsSync(tiktokenSrc)) {
    copyFile(tiktokenSrc, 'dist/tiktoken_bg.wasm');
  } else {
    console.warn('Warning: tiktoken_bg.wasm not found.');
  }
  
  // Build the UI
  try {
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
  } catch (uiError) {
      console.warn('****************************************************************');
      console.warn('WARNING: UI Build failed. The Web UI will not be available.');
      console.warn('The CLI tool will still function correctly.');
      console.warn('Error details:', uiError.message);
      console.warn('****************************************************************');
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}