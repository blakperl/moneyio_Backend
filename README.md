# Moneyio Backend

A backend API service developed by Ruqoyyah

## 📌 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Database Setup](#database-setup)
- [Testing](#testing)
- [API Routes](#api-routes)
- [Error Handling & Logging](#error-handling--logging)
- [Future Improvements](#future-improvements)


## Project Overview
MoneyIO Backend is a production-grade API built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**.
It powers core features of the MoneyIO platform including authentication, user management, role handling, wallet transactions and admin tools.

## Features

### 🔐 Authentication & Authorization
- Register & login  
- Password reset flow  
- JWT authentication  
- Role-based access control  
- Admin vs User permissions  

### 👤 User Management
- Get all users  
- Get user profile  
- Soft delete a user  
- Activate a user 

### 💰 Wallet & Transactions
- Create wallet for users  
- Fund wallet
- Withdraw from wallet  
- Transaction history  
- Transaction validation and error handling  

### 🛑 Error Handling & Logging
- Centralized error handler  
- Winston logger captures:  
  - Request method  
  - URL  
  - Request body
 
## Tech Stack

- **Node.js**  
- **Express.js**  
- **PostgreSQL**  
- **Prisma ORM**  
- **pgAdmin**  
- **Jest + Supertest** (testing)  
- **ES Modules**  
- **Winston Logger**

## Project Structure
```
.
moneyio-backend/
│──src/
│ ├──config/
│ ├──http/
│ │ ├──middlewares/
│ │ ├──controllers/
│ ├──routes/
│ ├──services/
│ ├──repo/
│ ├──validations/
│ ├──utils/
│ │ └──logger.js
│ ├──prisma/
│ │ └──schema.prisma
│ └──app.js
│
│──tests/
│──prisma/
│──package.json
│──README.md
│──.env.example
```
## Prerequisites

- Node.js (v16 or higher)
- Express js
- npm
- A database supported by Prisma (PostgreSQL)


## Setup & Installation

1. Clone the repository:

   ```
   git clone https://github.com/blakperl/Moneyio_Backend.git
   cd Moneyio_Backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your database connection details:

   ```
   DATABASE_URL=your_database_connection_string
   PORT=3000
   JWT_SECRET="your-secret-key"
   ```

## Database Setup

1. Generate Prisma Client:

   ```
   npm run generate:dev
   ```

2. Run database migrations:

   ```
   npm run migrate:dev
   ```
   
   ```
   npx prisma studio
   ```

3. Start your server and open PgAdmin to explore and manipulate your database:

   ```
   npm run dev
   ```

## Testing

```
npm test
```

## API Routes

The API routes are organized in the `src/routes` directory. 

## Error Handling & Logging

Errors go through a centralized middleware:  

- If the error is **operational** → return the specific message  
- If not → return `"Internal Server Error"`  

All errors are logged via `logger.error()` including:  
- Message  
- Route  
- Method  
- Stack  
- Request body  

### Example Response
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Future Improvements

- Add rate limiting to APIs  
- Implement Swagger/OpenAPI documentation  
- Introduce caching (e.g., Redis) for faster responses  
- Add CI/CD integration for automated deployments  
- Improve test coverage and add more end-to-end tests
- Improve the routes  
- Enhance monitoring and alerting for production errors  
