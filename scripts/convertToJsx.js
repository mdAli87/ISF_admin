
// Script to convert TSX project to JSX
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const srcDir = path.resolve(__dirname, '../src');
const destDir = path.resolve(__dirname, '../jsx-version');

// Create destination directory
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Helper to convert a single file
function convertFile(filePath, destPath) {
  console.log(`Converting: ${filePath}`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace TypeScript annotations
  content = content
    // Remove type annotations
    .replace(/:\s*[A-Za-z0-9_<>[\](),\s|&.]+(?=[,=)])/g, '')
    // Remove interface and type definitions
    .replace(/^(export\s+)?(interface|type)\s+[^{]+{[\s\S]*?}(\s*;)?\s*$/gm, '')
    // Remove generic type parameters
    .replace(/<[^>]+>/g, '')
    // Remove import type statements
    .replace(/import\s+type\s+.*?from\s+["'].*?["'];/g, '')
    // Remove 'as' type assertions
    .replace(/\s+as\s+[A-Za-z0-9_<>[\](),\s|&.]+/g, '')
    // Remove export type statements
    .replace(/export\s+type\s+.*?;/g, '')
    // Fix potential issues with remaining TypeScript syntax
    .replace(/([a-zA-Z0-9_]+)\?\:/g, '$1:');
  
  // Write the modified content to the destination file
  const destFilePath = destPath.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');
  
  // Create directory if it doesn't exist
  const destDirPath = path.dirname(destFilePath);
  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }
  
  fs.writeFileSync(destFilePath, content);
}

// Function to process a directory recursively
function processDirectory(dirPath, destBasePath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(dirPath, entry.name);
    const destPath = path.join(destBasePath, entry.name);
    
    if (entry.isDirectory()) {
      // Process subdirectories recursively
      processDirectory(sourcePath, destPath);
    } else {
      // Check if it's a TypeScript file
      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        convertFile(sourcePath, destPath);
      } else if (!['.git', 'node_modules'].includes(entry.name)) {
        // Copy other files directly
        const destDirPath = path.dirname(destPath);
        if (!fs.existsSync(destDirPath)) {
          fs.mkdirSync(destDirPath, { recursive: true });
        }
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }
}

// Create package.json for the JSX version
function createPackageJson() {
  const srcPackageJson = require('../package.json');
  
  // Modify package.json to use Babel instead of TypeScript
  const jsxPackageJson = {
    ...srcPackageJson,
    devDependencies: {
      ...srcPackageJson.devDependencies,
      "@babel/core": "^7.22.5",
      "@babel/preset-env": "^7.22.5",
      "@babel/preset-react": "^7.22.5",
      "@vitejs/plugin-react": "^4.0.0",
      // Remove TypeScript related dependencies
      "@types/react": undefined,
      "@types/react-dom": undefined,
      "typescript": undefined
    }
  };
  
  // Write the modified package.json
  fs.writeFileSync(
    path.join(destDir, 'package.json'),
    JSON.stringify(jsxPackageJson, null, 2)
  );
}

// Create babel.config.js
function createBabelConfig() {
  const babelConfig = `module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
`;
  fs.writeFileSync(path.join(destDir, 'babel.config.js'), babelConfig);
}

// Create vite.config.js for JSX
function createViteConfig() {
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
`;
  fs.writeFileSync(path.join(destDir, 'vite.config.js'), viteConfig);
}

// Copy public folder
function copyPublicFolder() {
  const publicSrcDir = path.resolve(__dirname, '../public');
  const publicDestDir = path.join(destDir, 'public');
  
  if (fs.existsSync(publicSrcDir)) {
    if (!fs.existsSync(publicDestDir)) {
      fs.mkdirSync(publicDestDir, { recursive: true });
    }
    
    const entries = fs.readdirSync(publicSrcDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(publicSrcDir, entry.name);
      const destPath = path.join(publicDestDir, entry.name);
      
      if (entry.isDirectory()) {
        // Use recursive copy for directories
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  }
}

// Main execution
try {
  // Process the source directory
  processDirectory(srcDir, path.join(destDir, 'src'));
  
  // Create configuration files
  createPackageJson();
  createBabelConfig();
  createViteConfig();
  
  // Copy public folder
  copyPublicFolder();
  
  console.log('Conversion completed successfully!');
  console.log(`JSX version is available in: ${destDir}`);
  console.log('To use the JSX version:');
  console.log(`1. cd ${path.relative(process.cwd(), destDir)}`);
  console.log('2. npm install');
  console.log('3. npm run dev');
} catch (error) {
  console.error('Error during conversion:', error);
}
