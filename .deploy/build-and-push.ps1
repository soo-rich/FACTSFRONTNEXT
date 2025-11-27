# Configuration
$DOCKER_USERNAME = "sooulrich933"
$IMAGE_NAME = "soosmart-facts-front"
$VERSION = if ($args[0]) { $args[0] } else { Get-Date -Format "yyyyMMdd-HHmmss" }
$LATEST_TAG = "latest"

# Remonter au répertoire racine du projet
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\.."

Write-Host "🚀 Début du processus de build et push..." -ForegroundColor Cyan
Write-Host "📍 Répertoire: $(Get-Location)" -ForegroundColor Gray

# # Nettoyage
# Write-Host "🧹 Nettoyage des fichiers de build précédents..." -ForegroundColor Yellow
# if (Test-Path ".next") {
#     Remove-Item -Recurse -Force .next
# }

# # Installation des dépendances (avec script postinstall)
# Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
# pnpm install

# if ($LASTEXITCODE -ne 0) {
#     Write-Host "❌ Échec de l'installation des dépendances" -ForegroundColor Red
#     exit 1
# }

# # Build Next.js en local
# Write-Host "🔨 Build de l'application Next.js..." -ForegroundColor Cyan
# pnpm run build

# if ($LASTEXITCODE -ne 0) {
#     Write-Host "❌ Échec du build Next.js" -ForegroundColor Red
#     exit 1
# }

# Write-Host "✅ Build Next.js réussi !" -ForegroundColor Green

# Build de l'image Docker (le build Next.js se fait dans Docker)
Write-Host "📦 Build de l'image Docker avec le build local..." -ForegroundColor Cyan
docker build --no-cache -t "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec du build Docker" -ForegroundColor Red
    exit 1
}

# Tag latest
docker tag "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"

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
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
docker push "${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push réussi !" -ForegroundColor Green
    Write-Host "🎉 Images disponibles:" -ForegroundColor Cyan
    Write-Host "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}" -ForegroundColor Gray
    Write-Host "   - ${DOCKER_USERNAME}/${IMAGE_NAME}:${LATEST_TAG}" -ForegroundColor Gray
    Write-Host "   📍 https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}" -ForegroundColor Blue
} else {
    Write-Host "❌ Échec du push" -ForegroundColor Red
    exit 1
}

Write-Host "🏁 Processus terminé avec succès !" -ForegroundColor Green
