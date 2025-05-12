#!/bin/bash

# Script to fix CSS styling issues by rebuilding Tailwind CSS
echo "Starting CSS fix process..."

# Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "next dev" || true

# Clean Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next

# Clean node_modules/.cache 
echo "Cleaning node_modules/.cache..."
rm -rf node_modules/.cache

# Ensure dependencies are installed
echo "Installing necessary dependencies..."
npm install --save-dev postcss-import postcss-flexbugs-fixes postcss-preset-env @tailwindcss/typography @tailwindcss/forms --legacy-peer-deps

# Make a backup of the original globals.css
echo "Backing up globals.css..."
cp ./app/globals.css ./app/globals.css.bak

# Build Tailwind CSS with direct output to simplify pipeline
echo "Rebuilding Tailwind CSS..."
npx tailwindcss -i ./app/globals.css -o ./app/output.css

# Create a minimal CSS file with basic styling in case of errors
echo "Creating backup CSS with essential styling..."
cat <<EOT > ./app/essential.css
/* Backup essential CSS in case Tailwind fails to load */
html, body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
  margin: 0;
  padding: 0;
}

a {
  color: #9370DB;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button, .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background-color: #9370DB;
  color: white;
  border: none;
  cursor: pointer;
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.flex {
  display: flex;
}

.min-h-screen {
  min-height: 100vh;
}

.flex-col {
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
}

.w-full {
  width: 100%;
}

.pt-20 {
  padding-top: 5rem;
}
EOT

# Create an inline styles file to add directly in the head tag
echo "Creating inline styles file..."
cat <<EOT > ./app/inline-styles.js
export const inlineStyles = \`
  /* Critical path CSS that should be inlined */
  body, html {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #fff;
    color: #333;
  }
  .flex {
    display: flex;
  }
  .flex-col {
    flex-direction: column;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-full {
    width: 100%;
  }
  .pt-20 {
    padding-top: 5rem;
  }
\`;
EOT

echo "CSS fix process completed. Now starting the development server..."
npm run dev 