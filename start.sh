#!/bin/sh
set -e

echo "🚀 Starting Hono API (background)…"
cd /app/api && PORT=3001 node dist/index.js &

# Wait until API is actually ready before starting Next.js
until node -e "require('net').createConnection(3001,'localhost').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null; do sleep 0.2; done
echo "✅ API ready"

echo "🌐 Starting Next.js (standalone)…"
cd /app && PORT=3000 HOSTNAME=0.0.0.0 exec node server.js
