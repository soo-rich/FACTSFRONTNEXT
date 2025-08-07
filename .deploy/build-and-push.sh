#!/bin/bash
#etape 1
cd ..

# Configuration
DOCKER_USERNAME="sooulrich933"
IMAGE_NAME="facts"
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}  # Version basée sur timestamp ou argument
LATEST_TAG="latest"
APPROACH="2"  # Change à "2" pour l'approche 2

echo "🚀 Début du processus de build et push (Approche $APPROACH avec pnpm)..."



# Build de l'image Docker
echo "📦 Build de l'image Docker..."
docker build -f Dockerfile -t $DOCKER_USERNAME/$IMAGE_NAME:$VERSION .
docker build -f Dockerfile -t $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG .

if [ $? -eq 0 ]; then
    echo "✅ Build Docker réussi !"
else
    echo "❌ Échec du build Docker"
    exit 1
fi

# Login sur Docker Hub
echo "🔐 Connexion à Docker Hub..."
docker login

# Push vers Docker Hub
echo "📤 Push vers Docker Hub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$VERSION
docker push $DOCKER_USERNAME/$IMAGE_NAME:$LATEST_TAG

if [ $? -eq 0 ]; then
    echo "✅ Push réussi !"
    echo "🎉 Ton image est disponible sur : https://hub.docker.com/repositories/$DOCKER_USERNAME/$IMAGE_NAME"
else
    echo "❌ Échec du push"
    exit 1
fi

echo "🏁 Processus terminé !"
