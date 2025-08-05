# Dockerfile ultra simple - Copy tout, puis install, puis build
FROM node:18-alpine

# Installer pnpm et dépendances système
RUN npm install -g pnpm && \
    apk add --no-cache libc6-compat curl

# Créer le répertoire de travail
WORKDIR /app

# Copier TOUT le projet en premier
COPY . .

# Configuration pnpm pour éviter les warnings
RUN pnpm config set auto-install-peers true && \
    pnpm config set strict-peer-dependencies false

# Variables d'environnement
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Installer les dépendances (maintenant tous les fichiers sont présents)
RUN pnpm install --frozen-lockfile

# Build de l'application
RUN pnpm run build

# Créer utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
#HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
#    CMD curl -f http://localhost:3000/ || exit 1

# Démarrer l'application
CMD ["pnpm", "start"]
