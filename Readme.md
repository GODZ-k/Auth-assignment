# Authentication and Authorization API

## Overview

This project is a Node.js application that provides authentication and authorization functionalities using Express.js. It includes user registration, login, logout, profile management, password reset, and role-based access control.

## Dependencies

- express
- cors
- bcryptjs
- @arcjet/node
- cookie-parser
- jsonwebtoken
- zod
- dotenv
- mongoose
- nodemon
- zod

## Configuration

### Environment Variables

Ensure you have the following environment variables set in your `.env.local` file:

````bash
PORT="port"
DATABASE_URL="database url"

ACCESS_TOKEN_SECRET_KEY="secret"
ACCESS_TOKEN_EXPIRY="1h"

REFRESH_TOKEN_SECRET_KEY="secret"
REFRESH_TOKEN_EXPIRY="10d"

VERIFICATION_TOKEN_SECRET_KEY="secret"
VERIFICATION_TOKEN_EXPIRY="1d"

ARCJET_ENV=development
ARCJET_KEY="Your arkjet api key"

### Testing the Application

## follow these steps:

1. **Install Dependencies**: Ensure all dependencies are installed by running:
    ```bash
    npm install
    ```

2. **Start the Server**: Start the server using:
    ```bash
    npm start
    ```
    or if you are using nodemon for development:
    ```bash
    npm run dev
    ```

3. **API Endpoints**: Use a tool like Postman or cURL to test the following API endpoints:

### the base url will be http://localhost:8081/api/v1


    - **Register**:
        ```http
        POST /api/auth/register
        ```
        Body:
        ```json
        {
            "username": "your_username",
            "email": "your_email",
            "password": "your_password"
            "confirmPassword": "your_password"
        }

        Response:
        ```json
        {
            "success": true,
            "createdUser": {
                "username": "username",
                "email": "email@email.com",
                "role": "role"
            },
            "accessToken": "token",
            "msg": "User registered successfully"
        } ```

    - **Login**:
        ```http
        POST /api/auth/login
        ```
        Body:
        ```json
        {
            "email": "your_email",
            "password": "your_password"
        }
        ```
        Response:
        ```json
        {
            "success": true,
            "loggedInUser": {
        "username": "tanmay",
        "email": "tanmay@tanmay.com",
        "role": "user"
    }
            "msg": "User logged in successfully"
        }
        ```

    - **Logout**:
        ```http
        POST /api/auth/logout
        ```
        Headers:
        ```http
        Authorization: Bearer <access_token> or can send inside the cookies automatically
        ```
        Response:
        ```json
        {
            "success": true,
            "msg": "User logged out successfully"
        }
        ```

    - **Profile**:
        ```http
        GET /api/auth/profile
        ```
        Headers:
        ```http
        Authorization: Bearer <access_token> or can send inside the cookies automatically
        ```
        Response:
        ```json
        {
            "success": true,
            "user": {
                "username": "username",
                "email": "email@email.com",
                "role": "role"
            }
        }
        ```

    - **Password Reset**:
        ```http
        PUT /api/auth/reset/password
        ```
        Body:
        ```json
       {
    "newPassword":"Aa@112233",
    "confirmPassword":"Aa@112233"
}
        ```
        Response:
        ```json
        {
            "success": true,
            "msg": "Password updated successfully"
        }
        ```

    - **forgot Password**:
        ```http
        POST /api/auth/forgot/password
        ```
        Body:
        ```json
        {
            "email": "your_email"
        }
        ```
        Response:
        ```json
       {
    "success": true,
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzhhNGM5N2YwNjcwYTE4Zjk4ODA2OGIiLCJpYXQiOjE3MzcxMTc4NDEsImV4cCI6MTczNzIwNDI0MX0.8sXx3b_ybW8FeNizDesGTQqnHFukK2uRjP9pOqmw8m4",
    "msg": "Password reset link sent to your email"
}
        ```

    - **Update profile**:
        ```http
        POST /api/auth/update/
        ```
        Body:
        ```json
        {
    "email":"rohit@gmail.com",
    "username":"rohitt"
}
        ```
        Response:
        ```json
        {
    "success": true,
    "msg": "User updated successfully",
    "updatedUser": {
        "username": "roh2itt",
        "email": "rohi2t@gmail.com",
        "role": "user",
        "createdAt": "2025-01-17T12:27:03.795Z",
        "updatedAt": "2025-01-17T13:30:25.600Z"
    }
}
        ```
    - **Admin get registered user**:
        ```http
        GET /api/auth/users/
        ```
        Require ADMIN
        ```
        Response:
        ```json
        {
    "success": true,
    "msg": "User found successfully",
    "users": [{
        "username": "roh2itt",
        "email": "rohi2t@gmail.com",
        "role": "user",
        "createdAt": "2025-01-17T12:27:03.795Z",
        "updatedAt": "2025-01-17T13:30:25.600Z"
    }]
}
        ```

        ```
    - **Admin delete user**:
        ```http
        DELETE /api/auth/user/:userId
        ```
        Require ADMIN
        ```
        Response:
        ```json
        {
    "success": true,
    "msg": "User deleted successfully"
    }
        ```
        ```
    - **Admin get single user**:
        ```http
        GET /api/auth/user/:userId
        ```
        Require ADMIN
        ```
        Response:
        ```json
        {
    "success": true,
    "user": {
        "username": "tanmay",
        "email": "tanmay@tanmay.com",
        "role": "user",
        "createdAt": "2025-01-17T12:12:45.634Z",
        "updatedAt": "2025-01-17T12:16:14.143Z"
    }
}
        ```

        ```
    - **Admin Change user role**:
        ```http
        PUT /api/auth/user/:userId
        ```body
        {
    "role":"admin"
}
        ```
        Response:
        ```json
        {
    "success": true,
    "msg:"user role has been changed",
    "user": {
        "username": "tanmay",
        "email": "tanmay@tanmay.com",
        "role": "user",
        "createdAt": "2025-01-17T12:12:45.634Z",
        "updatedAt": "2025-01-17T12:16:14.143Z"
    }
}
        ```



4. **Environment Variables**: Ensure your `.env.local` file is correctly configured with the necessary environment variables as mentioned in the Configuration section.

5. **Database**: Make sure your MongoDB instance is running and accessible via the `DATABASE_URL` specified in your environment variables.

By following these steps, you can effectively test the authentication and authorization functionalities of your application.
````
