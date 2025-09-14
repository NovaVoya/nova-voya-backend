# FROM node:20-alpine AS base
# WORKDIR /usr/src/app
# RUN corepack enable

# # Copy only what’s needed to resolve deps (better cache)
# COPY package.json ./
# # required for reproducible installs (commit this!)
# COPY pnpm-lock.yaml ./

# # Pre-fetch deps for cache
# RUN pnpm fetch

# # ---- Dev image (hot reload) ----
# FROM base AS dev
# RUN pnpm install --frozen-lockfile --offline
# COPY . .
# EXPOSE 3000
# CMD ["pnpm", "run", "start:dev"]

# # ---- Build stage for prod ----
# FROM base AS build
# RUN pnpm install --frozen-lockfile --offline
# COPY . .
# RUN pnpm run build
# RUN pnpm prune --prod

# # ---- Prod runtime ----
# FROM node:20-alpine AS prod
# WORKDIR /usr/src/app
# ENV NODE_ENV=production
# COPY --from=build /usr/src/app/package.json ./package.json
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist
# EXPOSE 3000
# CMD ["node", "dist/main.js"]


# -------- Base image with pnpm enabled via Corepack
FROM node:20-alpine AS base
WORKDIR /app
# enable corepack for pnpm
RUN corepack enable

# -------- Dependencies (offline cache)
FROM base AS deps
# Copy only the files needed to resolve dependencies
COPY package.json pnpm-lock.yaml ./
# Pre-fetch dependencies into pnpm store (no node_modules yet)
RUN pnpm fetch

# -------- Builder (install offline + build)
FROM base AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY package.json ./
# If you use NestJS with a typical structure, copy sources:
COPY tsconfig*.json ./
COPY src ./src
# If you have other files (e.g. nest-cli.json), copy them too:
# COPY nest-cli.json ./

# Install dependencies using offline store, then build
RUN pnpm install --frozen-lockfile --offline
RUN pnpm build

# -------- Runtime (smallest possible)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Bring in only the pieces we need
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /root/.local/share/pnpm/store /root/.local/share/pnpm/store
# Production deps only
RUN corepack enable && pnpm install --prod --frozen-lockfile --offline

# Copy built dist
COPY --from=builder /app/dist ./dist

# If your app needs a .env at runtime, mount it or bake specific vars via compose.
EXPOSE 3000
CMD ["node", "dist/main.js"]
