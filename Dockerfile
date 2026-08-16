# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=22
ARG PNPM_VERSION=11.21.0

################################################################################
# Base commune à l'exécution : node seul, sans pnpm (inutile pour `next start`).
FROM node:${NODE_VERSION}-alpine AS runtime-base

# Set working directory for all build stages.
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

################################################################################
# Base des stages de build : ajoute pnpm.
FROM runtime-base AS base

# Install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

################################################################################
# Toutes les dépendances (dev incluses), nécessaires pour `next build`.
# Seuls les manifestes sont copiés : cette couche n'est réinstallée que si
# package.json / pnpm-lock.yaml changent, pas à chaque modification du code.
# --ignore-scripts : le postinstall (build:icons) a besoin de src/, absent ici.
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

################################################################################
# Dépendances de production uniquement — c'est ce node_modules qui part dans
# l'image finale (sans typescript, eslint, @iconify/json, etc.).
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod --ignore-scripts

################################################################################
# Create a stage for building the application.
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Générer le CSS des icônes (normalement fait par le postinstall) puis builder.
RUN pnpm build:icons && pnpm build

# Le cache de build webpack/turbopack pèse plusieurs centaines de Mo et n'a
# aucune utilité à l'exécution ; Next recrée .next/cache au démarrage si besoin.
RUN rm -rf .next/cache

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM runtime-base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# /app est créé par WORKDIR sous root : sans ça, l'utilisateur node ne peut pas
# y écrire (Next y crée des fichiers temporaires et .next/cache au démarrage).
RUN chown node:node /app

# Run the application as a non-root user.
USER node

# Dépendances de production + sortie de build. --chown pour que `next start`
# puisse écrire dans .next/cache (ISR, optimisation d'images).
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/next.config.ts ./next.config.ts

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
# On invoque next directement : `pnpm start` déclencherait la vérification
# automatique des dépendances de pnpm, qui tente un `pnpm install` en écriture.
CMD ["node_modules/.bin/next", "start"]
