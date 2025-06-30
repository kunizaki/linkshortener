# Shorter Link Server

This is the server component of the Shorter Link application.

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the example environment file:
   ```
   cp .env.example .env
   ```
5. Update the environment variables in `.env` if needed

## Running the Application

### With Database Setup

To start the application with automatic database setup:

```
npm run dev:setup
```

This command will:
1. Ensure the PostgreSQL container is running
2. Create the database if it doesn't exist
3. Start the application in development mode

### Manual Steps

If you prefer to set up the database separately:

1. Ensure the database exists:
   ```
   npm run db:ensure
   ```

2. Start the application:
   ```
   npm run dev
   ```

## Database Management

- Generate migrations: `npm run db:generate`
- Run migrations: `npm run db:migrate`
- Push schema changes: `npm run db:push`
- Open Drizzle Studio: `npm run db:studio`

## Testing

- Run tests once: `npm run test`
- Run tests in watch mode: `npm run test:watch`

## Troubleshooting

### "database does not exist" Error

If you encounter a "database does not exist" error, run:

```
npm run db:ensure
```

This will ensure the PostgreSQL container is running and the database is created.