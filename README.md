# Backend Services for User Account and Transaction Management

This project implements two backend services that manage user accounts and transactions (send/withdraw) using Node.js, Express, Prisma, and PostgreSQL. The services are containerized using Docker and can be run using Docker Compose.

## Architecture

The project consists of two main services:

1. Account Manager Service:
   - Handles user authentication and authorization
   - Manages payment accounts for users
   - Stores payment history records

2. Payment Manager Service:
   - Handles transactions (send/withdraw)
   - Processes transactions using a core transaction process function
   - Updates account statements after successful transactions

## Tech Stack

- Node.js with Express framework
- PostgreSQL database
- Prisma ORM for database management
- Docker for containerization
- Docker Compose for running multi-container applications

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies for each service:
   ```
   cd account-manager
   npm install

   cd ../payment-manager
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in each service directory (`account-manager` and `payment-manager`).
   - Add the necessary environment variables, such as database connection details and API keys.

4. Start the services using Docker Compose:
   ```
   docker-compose up -d
   ```

   This command will build the Docker images and start the containers for both services.

## API Endpoints

### Account Manager Service

- `POST /auth/login`: User login with ID/Password
- `POST /auth/register`: User Register
- `POST /account`: Create a new payment account for the authenticated user
- `GET /account`: Retrieve all payment accounts for the authenticated user
- `GET /account/:id`: Retrieve a specific payment account by ID for the authenticated user
- `GET /account/:id/history`: Retrieve payment history for a specific account ID for the authenticated user

### Payment Manager Service

- `POST /payment/send`: Send a transaction from the user's account to another account
- `POST /payment/withdraw`: Withdraw funds from the user's account
- `GET /payment/:id`: Retrieve a specific transaction by ID
- `GET /payment/`: Retrieve all transactions for the authenticated user

## Database Schema

The project uses the following database schema:

```prisma
model PaymentAccount {
  id                  Int                @id @default(autoincrement())
  user_id             String
  account_type        String
  account_number      String
  balance             Decimal
  payment_histories   PaymentHistory[]
  sent_transactions   Transaction[]      @relation("SentTransactions")
  received_transactions Transaction[]    @relation("ReceivedTransactions")
}

model PaymentHistory {
  id                Int            @id @default(autoincrement())
  payment_account   PaymentAccount @relation(fields: [account_id], references: [id])
  account_id        Int
  transaction_id    String
  amount            Decimal
  transaction_type  String
  created_at        DateTime       @default(now())
}

model Transaction {
  id                String           @id @default(uuid())
  from_account      PaymentAccount?  @relation("SentTransactions", fields: [from_account_id], references: [id])
  from_account_id   Int
  to_account        PaymentAccount?  @relation("ReceivedTransactions", fields: [to_account_id], references: [id])
  to_account_id     Int?
  amount            Decimal
  timestamp         DateTime
  status            String           @default("pending")
  currency          String           @default("IDR")
  created_at        DateTime         @default(now())
  updated_at        DateTime         @updatedAt
}
```

## ERD
![ConcreteDB ERD](https://res.cloudinary.com/dtgpkhylr/image/upload/v1715405224/samples/fmbpv6creyd0adhszl4n.png)

## Transaction Processing

The core transaction processing function is implemented in the Payment Manager service. It simulates a long-running process using a setTimeout function. The function takes a transaction object as input and returns a promise that resolves after 30 seconds, indicating that the transaction has been processed successfully.

## Error Handling

The services implement error handling for various scenarios, such as missing required fields, insufficient balance, and account not found. Appropriate error responses are returned to the client with corresponding status codes.

## Authentication and Authorization

User authentication is handled using a third-party authentication service (e.g., Supabase). The Account Manager service verifies the user's credentials and generates an access token upon successful login. The access token is then used to authenticate and authorize requests to the protected endpoints.

## Logging

The services include logging statements to track important events and errors. Logs are outputted to the console and can be further extended to integrate with a centralized logging system.


# Take home assignment


## Description:
Build 2 Backend services which manages user’s accounts and transactions (send/withdraw). 

In Account Manager service, we have:
- User: Login with Id/Password
- Payment Account: One user can have multiple accounts like credit, debit, loan...
- Payment History: Records of transactions

In Payment Manager service, we have:
- Transaction: Include basic information like amount, timestamp, toAddress, status...
- We have a core transaction process function, that will be executed by `/send` or `/withdraw` API:

```js
function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing started for:', transaction);

        // Simulate long running process
        setTimeout(() => {
            // After 30 seconds, we assume the transaction is processed successfully
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 30000); // 30 seconds
    });
}

// Example usage
let transaction = { amount: 100, currency: 'USD' }; // Sample transaction input
processTransaction(transaction)
    .then((processedTransaction) => {
        console.log('transaction processing completed for:', processedTransaction);
    })
    .catch((error) => {
        console.error('transaction processing failed:', error);
    });
```

Features:
- Users need to register/log in and then be able to call APIs.
- APIs for 2 operations send/withdraw. Account statements will be updated after the transaction is successful.
- APIs to retrieve all accounts and transactions per account of the user.
- Write Swagger docs for implemented APIs (Optional)

### Tech-stack:
- Recommend using authentication 3rd party: Supertokens, Supabase...
- `NodeJs/Golang` for API server (`Fastify/Gin` framework is the best choices)
- `PostgreSQL/MongoDB` for Database. Recommend using `Prisma` for ORM.
- `Docker` for containerization. Recommend using `docker-compose` for running containers.
 
## Target:
- Good document/README to describe your implementation.
- Make sure app functionality works as expected. Run and test it well.
- Containerized and run the app using Docker.
- Using `docker-compose` or any automation script to run the app with single command is a plus.
