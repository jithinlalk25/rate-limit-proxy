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
- npm or yarn

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
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

## Rate Limiting Strategy

The service implements a token bucket algorithm for rate limiting with the following characteristics:

- Each application has its own rate limit configuration
- Rate limits are defined by:
  - Requests per time window
  - Time window duration
- Limits are enforced across all endpoints for each application
- Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests allowed in the window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit will reset

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
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRATION` - JWT token expiration time (e.g., '24h')
- `DEFAULT_RATE_LIMIT` - Default number of requests allowed per window (optional)
- `DEFAULT_RATE_WINDOW` - Default time window in seconds for rate limiting (optional)

Example `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rate-limit-proxy
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h
DEFAULT_RATE_LIMIT=100
DEFAULT_RATE_WINDOW=3600
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
