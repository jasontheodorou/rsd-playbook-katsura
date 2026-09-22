# Multi-target image. `runner` is what the company would run; `migrate` applies database migrations.
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The build must succeed with no database reachable.
RUN npm run build

# One-shot: apply committed migrations, then exit.
FROM builder AS migrate
CMD ["npm", "run", "migrate"]

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3019 HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p media && chown nextjs:nodejs media
USER nextjs
EXPOSE 3019
CMD ["node", "server.js"]
