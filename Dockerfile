# =============================================================================
# Stage 1: Build frontend (Next.js standalone) + compile API (tsc)
# =============================================================================
FROM node:24-slim AS builder
WORKDIR /app

# --- Frontend deps (cached separately from source) ---
COPY package*.json ./
RUN npm ci

# --- API deps (cached separately from source) ---
COPY api/package*.json ./api/
RUN cd api && npm ci

# --- Frontend build (standalone mode → .next/standalone) ---
COPY . .
# Disable Next.js telemetry during build (no outbound ping → faster CI)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- API build (tsc → api/dist/) ---
RUN cd api && npx tsc

# =============================================================================
# Stage 2: Runtime (minimal, non-root, arm64-compatible)
# =============================================================================
FROM node:24-slim
WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# --- Frontend runtime (standalone — no node_modules needed) ---
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static      ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public             ./public

# --- API runtime (compiled JS — no tsx needed) ---
COPY --from=builder --chown=nextjs:nodejs /app/api/dist           ./api/dist
COPY --from=builder --chown=nextjs:nodejs /app/api/node_modules   ./api/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/api/package.json   ./api/package.json

# --- Entrypoint ---
COPY --chown=nextjs:nodejs start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs
EXPOSE 3000
CMD ["./start.sh"]
