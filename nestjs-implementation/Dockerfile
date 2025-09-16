# syntax=docker/dockerfile:1.7

# 1) Builder image
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (use lockfile if present)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# 2) Runtime image
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy only what we need to run
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=builder /app/dist ./dist

# Expose Nest default port
EXPOSE 3000

# Configure health-friendly defaults
ENV PORT=3000 \
    TZ=UTC

# Start the app
CMD ["node", "dist/main.js"]