# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.20.0
ARG PNPM_VERSION=11.19.0

FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN apk add --no-cache libc6-compat openssl \
  && corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile

FROM base AS builder
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# This target is deliberately separate from the public runtime image. It keeps
# Prisma's CLI available for the one-shot migration service in Compose.
FROM base AS migrate
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm db:generate
CMD ["sh", "-c", "pnpm db:migrate:deploy && pnpm db:seed"]

FROM node:${NODE_VERSION}-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache /app/storage/private \
  && chown -R nextjs:nodejs /app/.next /app/storage

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
