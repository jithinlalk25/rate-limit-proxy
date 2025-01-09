# Rate Limit Proxy

A robust API rate limiting proxy service built with Node.js, Express, and TypeScript. This service allows you to manage and control API request rates for multiple applications through a centralized proxy.

## Features

- User and Application management
- Configurable rate limiting per application
- MongoDB-based persistence
- TypeScript support
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/jithinlalk25/rate-limit-proxy.git
   cd rate-limit-proxy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your specific configuration values

4. Configure MongoDB:

   - Ensure MongoDB is running locally on port 27017
   - The application will automatically create a database named `rate-limit-proxy`

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` by default.

## API Documentation

For detailed API documentation, please visit our [Postman Collection](https://documenter.getpostman.com/view/your-collection-id).

### Main Endpoints

- `/users` - User management endpoints
- `/apps` - Application management endpoints
- `/` - Proxy endpoint for forwarding requests

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/rate-limit-proxy)
- `ENCRYPTION_KEY` - Encryption key for API keys (default: YCTi9Usas6MQ+5PJFJQN97jDLU7bdESjq1awp/pR+I0=)
