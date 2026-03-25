#!/bin/bash
################################################################################
# build-and-push.sh — Build et push de l'image Docker backend (Spring Boot)
#
# Usage :
#   ./build-and-push.sh [VERSION] [--no-cache]
#
# Exemples :
#   ./build-and-push.sh                    # Version auto (timestamp)
#   ./build-and-push.sh 1.2.0             # Version explicite
#   ./build-and-push.sh 1.2.0 --no-cache  # Sans cache Docker
################################################################################

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
DOCKER_USERNAME="${DOCKER_USERNAME:-sooulrich933}"
APP_NAME="facts-frontend"
VERSION="${1:-$(date +%Y%m%d-%H%M%S)}"
LATEST_TAG="latest"
FULL_IMAGE="${DOCKER_USERNAME}/${APP_NAME}"
NO_CACHE_FLAG=""

# ── Auteur / Métadonnées ─────────────────────────────────────────────────────
AUTHOR_NAME="${AUTHOR_NAME:-Sul04}"
AUTHOR_EMAIL="${AUTHOR_EMAIL:-sessoklinaulrich@gmail.com}"
BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
GIT_REVISION="$(git rev-parse --short HEAD 2>/dev/null || echo 'inconnu')"

# Option --no-cache passée en 2e argument
if [[ "${2:-}" == "--no-cache" ]]; then
    NO_CACHE_FLAG="--no-cache"
fi

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Se placer à la racine du projet (là où se trouve le Dockerfile)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# ── Vérification des prérequis ────────────────────────────────────────────────
echo -e "${BLUE}🔍 Vérification des prérequis...${NC}"

if ! command -v docker &>/dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé ou n'est pas dans le PATH${NC}"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ Dockerfile introuvable dans $(pwd)${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json introuvable — êtes-vous dans le bon répertoire ?${NC}"
    exit 1
fi

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀  Build & Push Docker Image — Spring Boot Backend         ║${NC}"
echo -e "${BLUE}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Image   : ${FULL_IMAGE}${NC}"
echo -e "${BLUE}║  Version : ${VERSION}${NC}"
echo -e "${BLUE}║  Tags    : ${VERSION}, ${LATEST_TAG}${NC}"
echo -e "${BLUE}║  Auteur  : ${AUTHOR_NAME} <${AUTHOR_EMAIL}>${NC}"
echo -e "${BLUE}║  Commit  : ${GIT_REVISION}${NC}"
echo -e "${BLUE}║  Cache   : ${NO_CACHE_FLAG:-activé}${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Build de l'image Docker ───────────────────────────────────────────────────
echo -e "${BLUE}🐳 Build de l'image Docker...${NC}"
BUILD_START=$(date +%s)

# Un seul build avec deux tags (évite le double build)
# Les labels OCI sont ajoutés dynamiquement (date, version, commit, auteur)
docker build -f Dockerfile ${NO_CACHE_FLAG} \
    --label "org.opencontainers.image.version=${VERSION}" \
    --label "org.opencontainers.image.created=${BUILD_DATE}" \
    --label "org.opencontainers.image.revision=${GIT_REVISION}" \
    --label "org.opencontainers.image.authors=${AUTHOR_NAME} <${AUTHOR_EMAIL}>" \
    -t "${FULL_IMAGE}:${VERSION}" \
    -t "${FULL_IMAGE}:${LATEST_TAG}" \
    .

BUILD_END=$(date +%s)
BUILD_DURATION=$((BUILD_END - BUILD_START))
echo -e "${GREEN}✅ Build Docker réussi en ${BUILD_DURATION}s !${NC}"

# ── Vérification de l'image ──────────────────────────────────────────────────
echo ""
echo -e "${BLUE}🔎 Vérification de l'image générée...${NC}"
docker image inspect "${FULL_IMAGE}:${VERSION}" --format='  Taille : {{.Size}} bytes | Créée : {{.Created}}' 2>/dev/null || true

# ── Nettoyage des images intermédiaires (stages builder) ─────────────────────
echo ""
echo -e "${YELLOW}🧹 Nettoyage des images intermédiaires (stages builder)...${NC}"
docker image prune --filter "label=stage=builder" -f 2>/dev/null || true

# ── Connexion à Docker Hub ────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}🔐 Connexion à Docker Hub...${NC}"
if ! docker login; then
    echo -e "${RED}❌ Échec de la connexion à Docker Hub${NC}"
    exit 1
fi

# ── Push vers Docker Hub ─────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}📤 Push de ${FULL_IMAGE}:${VERSION}...${NC}"
docker push "${FULL_IMAGE}:${VERSION}"

echo -e "${BLUE}📤 Push de ${FULL_IMAGE}:${LATEST_TAG}...${NC}"
docker push "${FULL_IMAGE}:${LATEST_TAG}"

echo ""
echo -e "${GREEN}✅ Push réussi !${NC}"
echo -e "${GREEN}🎉 Image disponible sur : https://hub.docker.com/r/${DOCKER_USERNAME}/${APP_NAME}${NC}"

# ── Commandes utiles pour la production ───────────────────────────────────────
echo ""
echo -e "${BLUE}📋 Commandes pour ton serveur de production :${NC}"
echo ""
echo "  # Récupérer l'image"
echo "  docker pull ${FULL_IMAGE}:${VERSION}"
echo "  docker pull ${FULL_IMAGE}:${LATEST_TAG}"
echo ""
echo "  # Lancer le conteneur (port 8082, profil prod)"
echo "  docker run -d \\"
echo "    --name ${APP_NAME} \\"
echo "    --env-file .env \\"
echo "    -p 3000:3000 \\"
echo "    --restart unless-stopped \\"
echo "    ${FULL_IMAGE}:${LATEST_TAG}"
echo ""
echo -e "${GREEN}🏁 Processus terminé !${NC}"
