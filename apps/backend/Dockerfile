# ── Stage 1: Build ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# Copy workspace config (needed for pnpm --filter to work)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/backend/prisma apps/backend/prisma

# Install all deps (dev included — needed for nest build)
RUN pnpm install --frozen-lockfile --filter backend...

# Copy source and build
COPY apps/backend/src apps/backend/src
COPY apps/backend/tsconfig.json apps/backend/tsconfig.json
COPY apps/backend/tsconfig.build.json apps/backend/tsconfig.build.json
COPY apps/backend/nest-cli.json apps/backend/nest-cli.json

RUN pnpm --filter backend build


# ── Stage 2: Production runtime ──────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

ENV NODE_ENV=production

# Copy workspace config
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/backend/prisma apps/backend/prisma

# Install production deps only
# prisma is now in dependencies (not devDependencies) so migrate deploy works
RUN pnpm install --frozen-lockfile --filter backend --prod

# Copy compiled output from builder
COPY --from=builder /app/apps/backend/dist apps/backend/dist

EXPOSE 4000

# Run migrations then start (Railway sets PORT automatically)
CMD ["sh", "-c", "pnpm --filter backend exec prisma migrate deploy && node apps/backend/dist/main"]
