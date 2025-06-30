# Dockerfile do server
FROM node:20-alpine

# Instala o cliente PostgreSQL (necessário para pg_isready)
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3333

# O CMD será sobrescrito pelo docker-compose, não precisa mudar aqui
CMD ["npm", "run", "dev"]
