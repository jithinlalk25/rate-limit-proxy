# Rate Limit Proxy

A robust API rate limiting proxy service built with Node.js, Express, and TypeScript. This service allows you to manage and control API request rates for multiple applications through a centralized proxy.

## Features

- User and Application management
- Configurable rate limiting per application
- MongoDB-based persistence
- TypeScript support
- RESTful API endpoints

### Rate Limiting Strategies

The service supports two rate limiting strategies:

1. **Fixed Window Rate Limiting**

   - Divides time into fixed windows (e.g., 1-minute intervals)
   - Tracks request count within each window
   - Resets counter at the start of each new window
   - Simple to implement and understand
   - Suitable for most general use cases

2. **Sliding Window Rate Limiting**
   - Uses a rolling time window that moves with the current time
   - More precise control over request distribution
   - Prevents request spikes between windows
   - Better for strict rate control requirements
   - Slightly more resource-intensive than fixed window

Each application can be configured with:

- Maximum number of requests (`requests`)
- Time window in seconds (`window`)
- Preferred strategy (`fixed_window` or `sliding_window`)

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

For detailed API documentation, please visit our [Postman Collection](https://documenter.getpostman.com/view/18015134/2sAYQUqZq6).

### Main Endpoints

- `/users` - User management endpoints
- `/apps` - Application management endpoints
- `/` - Proxy endpoint for forwarding requests
