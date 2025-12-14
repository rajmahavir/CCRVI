#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 1. Ensure we are in the project root to fix path issues
try {
  process.chdir(path.join(__dirname, '..'));
} catch (e) {
  console.error('Failed to change directory:', e);
}

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

  // 2. Ensure dependencies are installed (Brute force fix for git install)
  if (!fs.existsSync('node_modules')) {
    console.log('node_modules not found. Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // 3. Build CLI using binary path
  console.log('Building CLI application...');
  
  // Find esbuild binary
  const esbuildBin = path.resolve('node_modules', '.bin', 'esbuild');
  
  if (fs.existsSync(esbuildBin)) {
      console.log(`Using local esbuild: ${esbuildBin}`);
      execSync(`${esbuildBin} src/cli.ts --bundle --platform=node --packages=external --outfile=dist/cli.js`, { stdio: 'inherit' });
  } else {
      console.log('Local esbuild binary not found. Attempting via npx...');
      // Fallback
      execSync(`npx esbuild src/cli.ts --bundle --platform=node --packages=external --outfile=dist/cli.js`, { stdio: 'inherit' });
  }
  
  // 4. Copy tiktoken (with fallback search)
  console.log('Copying tiktoken WASM file...');
  let tiktokenSrc = path.join('node_modules', 'tiktoken', 'tiktoken_bg.wasm');
  if (!fs.existsSync(tiktokenSrc)) {
      console.warn('tiktoken_bg.wasm not found in root node_modules. Trying require resolution...');
      try {
          tiktokenSrc = require.resolve('tiktoken/tiktoken_bg.wasm');
      } catch (e) {
          console.warn('Could not resolve tiktoken via require.');
      }
  }

  if (fs.existsSync(tiktokenSrc)) {
    copyFile(tiktokenSrc, 'dist/tiktoken_bg.wasm');
  } else {
    console.warn('Warning: tiktoken_bg.wasm not found. Application may fail at runtime.');
  }
  
  // 5. Build UI (Optional / Fault Tolerant)
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