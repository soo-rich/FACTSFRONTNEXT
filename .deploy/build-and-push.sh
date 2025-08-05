#!/bin/bash

# etape 1
cd ..

# Script pour builder et pusher vers Docker Hub
set -e

# Variables de configuration
DOCKER_USERNAME="sooulrich933"  # Remplacez par votre username Docker Hub
APP_NAME="sbill"
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}  # Version basée sur timestamp ou argument
LATEST_TAG="latest"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}🚀 Build et Push - Tout dans le conteneur${NC}"
echo -e "${YELLOW}Version: $VERSION${NC}"

# Vérifications préliminaires
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker n'est pas démarré${NC}"
    exit 1
fi

# Vérifier les fichiers essentiels
required_files=("package.json" "next.config.ts")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Fichier manquant: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Fichiers requis présents${NC}"

# Connexion Docker Hub
echo -e "${BLUE}🔐 Vérification connexion Docker Hub...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}Connexion à Docker Hub...${NC}"
    docker login
fi

# Nettoyage préventif
echo -e "${BLUE}🧹 Nettoyage préventif...${NC}"
docker builder prune -f >/dev/null 2>&1 || true

# Build avec logs détaillés
echo -e "${GREEN}🔨 Construction de l'image (build dans le conteneur)...${NC}"
echo -e "${BLUE}Cela peut prendre plusieurs minutes...${NC}"

docker build \
    -t $DOCKER_USERNAME/$APP_NAME:$VERSION \
    -t $DOCKER_USERNAME/$APP_NAME:latest \
    --platform linux/amd64 \
    --progress=plain \
    . 2>&1 | tee build.log

# Vérification du build
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✅ Build réussi!${NC}"
else
    echo -e "${RED}❌ Échec du build${NC}"
    echo -e "${YELLOW}Dernières lignes des logs:${NC}"
    tail -20 build.log
    exit 1
fi

# Informations sur l'image
echo -e "${YELLOW}📏 Informations sur l'image:${NC}"
docker images $DOCKER_USERNAME/$APP_NAME:$VERSION --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Test rapide (optionnel mais recommandé)
echo -e "${BLUE}🧪 Test rapide de l'image...${NC}"
CONTAINER_ID=$(docker run -d -p 3001:3000 --name test-container $DOCKER_USERNAME/$APP_NAME:$VERSION)

# Attendre le démarrage
echo -e "${YELLOW}⏳ Attente du démarrage (15s)...${NC}"
sleep 15

# Test de santé
if curl -f http://localhost:3001 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Test réussi - L'application répond${NC}"
else
    echo -e "${YELLOW}⚠️  L'application ne répond pas encore (peut être normal)${NC}"
    echo -e "${BLUE}Logs du conteneur:${NC}"
    docker logs test-container --tail 10
fi

# Nettoyage du test
docker stop test-container >/dev/null 2>&1
docker rm test-container >/dev/null 2>&1

# Push vers Docker Hub
echo -e "${GREEN}📤 Push vers Docker Hub...${NC}"
docker push $DOCKER_USERNAME/$APP_NAME:$VERSION
docker push $DOCKER_USERNAME/$APP_NAME:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push réussi!${NC}"
else
    echo -e "${RED}❌ Échec du push${NC}"
    exit 1
fi

# Résumé final
echo -e "${GREEN}🎉 Succès complet!${NC}"
echo -e "${BLUE}📋 Résumé:${NC}"
echo -e "  Image: $DOCKER_USERNAME/$APP_NAME:$VERSION"
echo -e "  URL Docker Hub: https://hub.docker.com/r/$DOCKER_USERNAME/$APP_NAME"
echo -e "  Commande pour serveur: docker run -d -p 3000:3000 $DOCKER_USERNAME/$APP_NAME:$VERSION"

# Nettoyage final
docker image prune -f >/dev/null 2>&1

echo -e "${GREEN}Ready for deployment! 🚀${NC}"
