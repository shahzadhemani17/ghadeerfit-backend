# Backend Dockerfile
FROM node:18-slim AS base

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]

