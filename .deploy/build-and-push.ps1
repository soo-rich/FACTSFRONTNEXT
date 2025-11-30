# Configuration
$DOCKER_USERNAME = "sooulrich933"
$IMAGE_NAME = "soosmart-facts-front"
$VERSION = if ($args[0]) { $args[0] } else { Get-Date -Format "yyyyMMdd-HHmmss" }
$LATEST_TAG = "latest"

# Remonter au répertoire racine du projet
# $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
# Set-Location "$scriptPath\.."

Write-Host "🚀 Début du processus de build et push..." -ForegroundColor Cyan
Write-Host "📍 Répertoire: $(Get-Location)" -ForegroundColor Gray


# Build de l'image Docker (le build Next.js se fait dans Docker)
Write-Host "📦 Build de l'image Docker avec le build local..." -ForegroundColor Cyan
docker build --no-cache -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec du build Docker" -ForegroundColor Red
    exit 1
}

# Tag latest
# docker tag "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"

Write-Host "✅ Build Docker réussi !" -ForegroundColor Green

# Login sur Docker Hub
Write-Host "🔐 Connexion à Docker Hub..." -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec de la connexion à Docker Hub" -ForegroundColor Red
    exit 1
}

# Push vers Docker Hub
Write-Host "📤 Push vers Docker Hub..." -ForegroundColor Cyan
# docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push réussi !" -ForegroundColor Green
    Write-Host "🎉 Images disponibles:" -ForegroundColor Cyan
#     Write-Host "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" -ForegroundColor Gray
    Write-Host "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}" -ForegroundColor Gray
    Write-Host "   📍 https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}" -ForegroundColor Blue
} else {
    Write-Host "❌ Échec du push" -ForegroundColor Red
    exit 1
}


# Afficher la taille des images
Write-Host "`n📊 Taille des images:" "Cyan"
docker images | Select-String "$IMAGE_NAME"

# Proposer de nettoyer les images de build
Write-Host "`n🧹 Voulez-vous nettoyer les images de build intermédiaires? (O/N)" "Yellow"
$response = Read-Host
if ($response -eq "O" -or $response -eq "o") {
    docker image prune -f --filter label=stage=builder
    docker image prune -f --filter label=stage=base
    Write-Host "✅ Images de build nettoyées" "Green"
}

Write-Host "🏁 Processus terminé avec succès !" -ForegroundColor Green
