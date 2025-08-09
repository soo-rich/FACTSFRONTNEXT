# Utilise l'image Node.js officielle
FROM node:current-alpine3.21 AS base

# Installation de pnpm
RUN npm install -g pnpm

# Installation des dépendances seulement quand nécessaire
FROM base AS deps
WORKDIR /app

# Copie des fichiers de dépendances pnpm
COPY package.json pnpm-lock.yaml ./

# Installation avec pnpm
RUN pnpm install --frozen-lockfile --prod

# Installation des dev dependencies pour le build
FROM base AS builder
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json pnpm-lock.yaml ./

# Copie du code source
COPY . .

# Installation de toutes les dépendances (prod + dev)
RUN pnpm install --frozen-lockfile

# Désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED=1

# Build de l'application
RUN pnpm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie des fichiers publics
COPY --from=builder /app/public ./public

# Création du dossier .next avec les bonnes permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copie des fichiers de build (standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
