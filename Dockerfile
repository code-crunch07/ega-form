# ==============================================================================
# Stage 1: Install Dependencies
# ==============================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependency definitions and Prisma schema
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install exact dependencies
RUN npm ci

# ==============================================================================
# Stage 2: Build the Application
# ==============================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma Client code
RUN npx prisma generate

# Build Next.js with standalone output
RUN npm run build

# ==============================================================================
# Stage 3: Production Runner Image
# ==============================================================================
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create secure non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set up uploads directory and permissions
RUN mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/public

# Copy assets and standalone server from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
