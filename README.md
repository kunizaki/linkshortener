# Shorter Link

<div align="center">
  <p>
    <a href="https://github.com/rocketseat/linkshortener/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Shorter Link is released under the MIT license." />
    </a>
    <a href="https://github.com/rocketseat/linkshortener/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
    </a>
  </p>
</div>

<h4 align="center">
  A modern URL shortener application with a React frontend and Node.js backend.
</h4>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development](#-development)
  - [Using Docker](#using-docker)
  - [Local Development](#local-development)
- [Database Management](#-database-management)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- Create shortened URLs for long links
- Track link click statistics
- User authentication and management
- Responsive web interface
- RESTful API

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **ESLint** - Code linting

### Backend
- **Node.js** - JavaScript runtime
- **Fastify** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database toolkit
- **PostgreSQL** - Database

### Infrastructure
- **Docker** - Containerization
- **Cloudflare** - Storage for assets

## 📁 Project Structure

The project is organized into two main directories:

- `web/`: Frontend application built with React and Vite
- `server/`: Backend API built with Node.js, Fastify, and PostgreSQL

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) v16 or higher (for local development without Docker)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/rocketseat/linkshortener.git
   cd linkshortener
   ```

2. Create a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in `.env` with your values

4. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

This will start:
- Web application at http://localhost:5173
- Server API at http://localhost:3333
- PostgreSQL database at localhost:5432

### Environment Variables

| Variable | Description |
|----------|-------------|
| NODE_ENV | Environment mode (development, production) |
| DATABASE_URL | PostgreSQL connection string |
| POSTGRES_USER | PostgreSQL username |
| POSTGRES_PASSWORD | PostgreSQL password |
| POSTGRES_DB | PostgreSQL database name |
| VITE_API_URL | URL for the backend API |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare account ID for storage |
| CLOUDFLARE_ACCESS_KEY_ID | Cloudflare access key |
| CLOUDFLARE_SECRET_ACCESS_KEY | Cloudflare secret key |
| CLOUDFLARE_BUCKET | Cloudflare storage bucket name |
| CLOUDFLARE_PUBLIC_URL | Public URL for Cloudflare assets |

## 📄 License

This project is licensed under the [MIT License](LICENSE).
