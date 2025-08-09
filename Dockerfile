# Approche 2: Copie tout et build dans le conteneur (avec pnpm)
FROM node:18-alpine

WORKDIR /app

# Installer les dépendances système si nécessaire
RUN apk add --no-cache libc6-compat

# Installer pnpm globalement
RUN npm install -g pnpm

# Ajouter un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier tous les fichiers du projet (pour les scripts post-install)
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY .npmrc .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY next.config.js .
COPY public/ public/
COPY src/ src/

# Changer les permissions pour l'utilisateur nextjs
RUN chown -R nextjs:nodejs /app

# Passer à l'utilisateur nextjs pour l'installation et le build
USER nextjs

# Installer toutes les dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Build de l'application
RUN pnpm build

# Nettoyer les dépendances de dev (optionnel, pour réduire la taille)
RUN pnpm prune --prod

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["pnpm", "start"]
