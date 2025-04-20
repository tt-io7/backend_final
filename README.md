# E-Commerce Platform with Medusa.js

This project consists of two storefronts sharing a common Medusa.js backend:

1. **Traditional E-Commerce Storefront**: A standard e-commerce platform where customers can browse and purchase specific products.
2. **Mystery Box Store**: An innovative platform where customers input a budget, and the system selects random products within that budget.

## Project Structure

```
├── .env                 # Environment variables
├── medusa-config.ts     # Medusa.js configuration
├── src/                 # Medusa.js backend source code
├── storefront/          # Traditional e-commerce frontend (Next.js)
└── mystery-box/         # Mystery box store frontend (Next.js)
```

## Tech Stack

- **Backend**: Medusa.js (Node.js e-commerce framework)
- **Database**: PostgreSQL
- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **Authentication**: Next-Auth with Medusa.js
- **Payment Processing**: Stripe
- **Animations**: Framer Motion
- **3D Graphics**: Three.js

## Design Specifications

- **Color Scheme**: Lilac, white, and gold accents
- **Visual Elements**: Subtle animations and high-quality images, including 3D visuals
- **Layout**: Clean and minimalistic design for intuitive navigation

## Features

### Shared Features
- Product catalog management
- Order processing
- Customer data management
- Secure payment processing with Stripe

### Traditional Storefront
- Product browsing and filtering
- Product detail pages
- Shopping cart functionality
- Optional user accounts
- Guest checkout option

### Mystery Box Store
- Budget-based product selection
- Required user authentication
- Surprise element (products revealed only upon delivery)

## Setup Instructions

### Prerequisites
- Node.js (v20 or later)
- PostgreSQL
- Redis

### Backend Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   Make sure the `.env` file is properly configured with your database, Redis, and Stripe credentials.

4. Start the Medusa server:
   ```
   npm run dev
   ```

### Frontend Setup

#### Traditional Storefront

1. Navigate to the storefront directory:
   ```
   cd storefront
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the storefront at `http://localhost:3000`

#### Mystery Box Store

1. Navigate to the mystery-box directory:
   ```
   cd mystery-box
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the mystery box store at `http://localhost:3001`

## Authentication Implementation

### Mystery Box Store
- Account creation and login required before making purchases
- Secure authentication using Medusa.js routes

### Traditional Storefront
- Optional account creation
- Guest checkout available
- Account creation option during or after checkout

## Deployment

### Frontend
- Deploy Next.js applications to Vercel or Netlify

### Backend
- Deploy Medusa.js backend to Render or Heroku

## Additional Considerations

- **Security**: HTTPS, secure cookies, regular dependency updates
- **Performance**: Optimized images, caching, lazy loading
- **Accessibility**: Adherence to accessibility standards
