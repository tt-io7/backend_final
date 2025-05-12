#!/bin/bash

# Script to install PostCSS dependencies for layout fixes

echo "Installing PostCSS dependencies..."
npm install --save-dev postcss-import postcss-flexbugs-fixes postcss-preset-env

echo "Installing additional Tailwind plugins..."
npm install --save-dev @tailwindcss/typography @tailwindcss/forms

echo "Dependencies installed successfully!"
echo "Run ./restart-dev.sh to restart the development server with the new configuration."