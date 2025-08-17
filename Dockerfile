# Étape base
FROM node:current-alpine3.21 AS base
RUN npm install -g pnpm

# Étape deps : installation des dépendances
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY src ./src
RUN pnpm install --frozen-lockfile

# Étape build : build de l'application
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY public ./public
COPY *.ts *.json *.js *.mjs ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Étape runner : image finale de production
FROM base AS runner
WORKDIR /app

#ENV NODE_ENV=production
#ENV NEXT_TELEMETRY_DISABLED=1

# Création de l'utilisateur
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copie uniquement ce qui est nécessaire pour la production
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
