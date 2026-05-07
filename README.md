# Project Management Application - Backend

A full-featured backend API for a Project Management application built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**
  - User registration with email verification
  - Login/Logout functionality
  - JWT-based authentication
  - Password reset and change password
  - Email verification system
  - Refresh token mechanism

- **Secure Routes**
  - Protected routes with JWT middleware
  - Role-based access control
  - Secure password handling

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Email Service:** Nodemailer
- **Environment:** Dotenv

## Project Structure

```
src/
├── controllers/       # Route controllers
├── middlewares/       # Custom middlewares (auth, validation, etc.)
├── models/           # MongoDB models
├── routes/           # API routes
├── validators/       # Input validation schemas
├── utils/            # Utility functions
└── index.js          # Application entry point
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/dhruv552/backend-foundation.git
cd backend-foundation
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/projectmanagement
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=30d
SMTP_HOST=your_email_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

5. **Start the server**
```bash
npm start
```

Server runs on `http://localhost:8000`

## API Endpoints

### Authentication Routes

#### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/auth/verify-email/:token` | Verify email address |
| POST | `/api/v1/auth/refresh-token` | Get new access token |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:resetToken` | Reset forgot password |

#### Protected Routes (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/current-user` | Get current user info |
| POST | `/api/v1/auth/change-password` | Change current password |
| POST | `/api/v1/auth/resend-email-verification` | Resend verification email |

## Request/Response Examples

### Register User
**Request:**
```json
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password@123",
  "confirmPassword": "Password@123",
  "fullName": "Full Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account.",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "isEmailVerified": false
    }
  }
}
```

### Login User
**Request:**
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "isEmailVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Testing with Postman

1. Import the Postman collection: `postman_collection.json`
2. Create environment variables:
   - `accessToken` - Your JWT token from login
   - `refreshToken` - Your refresh token
3. Set the base URL in environment
4. Test all endpoints in the collection

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Email verification
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Rate limiting ready

## Middleware

- `verifyJWT` - JWT authentication middleware
- `validate` - Input validation middleware
- CORS - Cross-origin resource sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Dhruv Kumar**
- GitHub: [@dhruv552](https://github.com/dhruv552)

## Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Last Updated:** May 7, 2026
