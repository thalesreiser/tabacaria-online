# syntax=docker/dockerfile:1.7
# Backend image: Medusa server + admin, built from the monorepo root.
#   docker build -f infra/docker/backend.Dockerfile -t tabacaria-backend .
# Same image runs the API (default) or the worker (MEDUSA_WORKER_MODE=worker).

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    CI=true \
    TURBO_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY . .
# Only the backend and the workspace packages it depends on.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter "@tabacaria/backend..."
RUN pnpm --filter @tabacaria/shared-types build \
 && pnpm --filter @tabacaria/backend build
# Production dependencies only, with workspace packages copied in, then the compiled app.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm --filter @tabacaria/backend deploy --prod --legacy /out \
 && cp -r apps/backend/.medusa/server/. /out/

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=9000
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 9000
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 9000) + '/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node_modules/.bin/medusa", "start"]
