#!/bin/bash
################################################################################
# build-and-push.sh — Build & Push Docker universel
#
# Usage :
#   ./build-and-push.sh [OPTIONS]
#
# Options :
#   -v, --version VERSION       Version de l'image  (défaut: timestamp)
#   -u, --username USERNAME     Utilisateur registry (défaut: $DOCKER_USERNAME)
#   -n, --name APP_NAME         Nom de l'app         (défaut: auto-détecté)
#   -r, --registry REGISTRY     Registry cible       (défaut: docker.io)
#   -p, --port PORT             Port exposé          (défaut: auto-détecté)
#       --platform PLATFORMS    Plateformes buildx   (ex: linux/amd64,linux/arm64)
#       --dockerfile PATH       Chemin du Dockerfile (défaut: ./Dockerfile)
#       --no-cache              Désactiver le cache Docker
#       --build-only            Build sans push
#       --push-only             Push sans build
#       --dry-run               Afficher les commandes sans les exécuter
#   -y, --yes                   Ne pas demander confirmation avant le push
#   -h, --help                  Afficher cette aide
#
# Variables d'environnement supportées :
#   DOCKER_USERNAME, DOCKER_REGISTRY, APP_NAME, APP_PORT,
#   AUTHOR_NAME, AUTHOR_EMAIL, BUILD_PLATFORM
#
# Fichier de config optionnel (chargé automatiquement) :
#   .deploy/.build.conf  ou  .build.conf  (à la racine du projet)
#
# Exemples :
#   ./build-and-push.sh
#   ./build-and-push.sh -v 1.2.0 --no-cache
#   ./build-and-push.sh -v 1.2.0 -u myuser -n myapp -r ghcr.io
#   ./build-and-push.sh --build-only --dry-run
#   ./build-and-push.sh --platform linux/amd64,linux/arm64 -v 2.0.0
################################################################################

set -euo pipefail

# ── Couleurs ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; BLUE='\033[0;34m'; RED='\033[0;31m'
YELLOW='\033[0;33m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log_info()    { echo -e "${BLUE}ℹ  $*${NC}"; }
log_success() { echo -e "${GREEN}✔  $*${NC}"; }
log_warn()    { echo -e "${YELLOW}⚠  $*${NC}"; }
log_error()   { echo -e "${RED}✖  $*${NC}" >&2; }
log_step()    { echo -e "\n${BOLD}${CYAN}▶  $*${NC}"; }

die() { log_error "$*"; exit 1; }

# ── Aide ──────────────────────────────────────────────────────────────────────
usage() {
    sed -n '3,32p' "$0" | sed 's/^# //' | sed 's/^#//'
    exit 0
}

# ── Chemins ───────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Chargement du fichier de config optionnel ─────────────────────────────────
for CONF in "$SCRIPT_DIR/.build.conf" "$PROJECT_DIR/.build.conf"; do
    if [[ -f "$CONF" ]]; then
        log_info "Chargement de la config : $CONF"
        # shellcheck source=/dev/null
        source "$CONF"
        break
    fi
done

# ── Valeurs par défaut ────────────────────────────────────────────────────────
VERSION="${VERSION:-$(date +%Y%m%d-%H%M%S)}"
DOCKER_USERNAME="${DOCKER_USERNAME:-}"
APP_NAME="${APP_NAME:-}"
REGISTRY="${DOCKER_REGISTRY:-docker.io}"
APP_PORT="${APP_PORT:-}"
PLATFORM="${BUILD_PLATFORM:-}"
DOCKERFILE="Dockerfile"
AUTHOR_NAME="${AUTHOR_NAME:-}"
AUTHOR_EMAIL="${AUTHOR_EMAIL:-}"
NO_CACHE_FLAG=""
BUILD_ONLY=false
PUSH_ONLY=false
DRY_RUN=false
ASSUME_YES=false

# ── Parsing des arguments ─────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
    case "$1" in
        -v|--version)    VERSION="$2";       shift 2 ;;
        -u|--username)   DOCKER_USERNAME="$2"; shift 2 ;;
        -n|--name)       APP_NAME="$2";      shift 2 ;;
        -r|--registry)   REGISTRY="$2";      shift 2 ;;
        -p|--port)       APP_PORT="$2";      shift 2 ;;
           --platform)   PLATFORM="$2";      shift 2 ;;
           --dockerfile) DOCKERFILE="$2";    shift 2 ;;
           --no-cache)   NO_CACHE_FLAG="--no-cache"; shift ;;
           --build-only) BUILD_ONLY=true;    shift ;;
           --push-only)  PUSH_ONLY=true;     shift ;;
           --dry-run)    DRY_RUN=true;       shift ;;
        -y|--yes)        ASSUME_YES=true;    shift ;;
        -h|--help)       usage ;;
        *) die "Option inconnue : $1  →  Utilisez --help pour l'aide." ;;
    esac
done

# ── Fonction d'exécution (respecte --dry-run) ─────────────────────────────────
run() {
    if $DRY_RUN; then
        echo -e "${YELLOW}[dry-run]${NC} $*"
    else
        eval "$@"
    fi
}

# ── Auto-détection du nom de l'application ───────────────────────────────────
detect_app_name() {
    # 1. pom.xml (Spring Boot) — prend le 2e artifactId (celui du projet, pas le parent)
    if [[ -f "$PROJECT_DIR/pom.xml" ]]; then
        local name
        name=$(grep -m2 "<artifactId>" "$PROJECT_DIR/pom.xml" | tail -1 \
               | sed 's/.*<artifactId>\(.*\)<\/artifactId>.*/\1/' | xargs)
        [[ -n "$name" ]] && echo "$name" && return
    fi
    # 2. package.json (Node.js)
    if [[ -f "$PROJECT_DIR/package.json" ]] && command -v jq &>/dev/null; then
        local name
        name=$(jq -r '.name // empty' "$PROJECT_DIR/package.json" 2>/dev/null | xargs)
        [[ -n "$name" ]] && echo "$name" && return
    fi
    # 3. Nom du répertoire du projet
    basename "$PROJECT_DIR"
}

# ── Auto-détection du port ────────────────────────────────────────────────────
detect_port() {
    # 1. EXPOSE dans le Dockerfile
    local expose
    expose=$(grep -i "^EXPOSE" "$PROJECT_DIR/$DOCKERFILE" 2>/dev/null | awk '{print $2}' | head -1)
    [[ -n "$expose" ]] && echo "$expose" && return

    # 2. application.properties (Spring Boot)
    local props="$PROJECT_DIR/src/main/resources/application.properties"
    if [[ -f "$props" ]]; then
        local port
        port=$(grep "^server.port" "$props" 2>/dev/null | cut -d= -f2 | xargs)
        [[ -n "$port" ]] && echo "$port" && return
    fi

    # 3. application.yml (Spring Boot)
    local yml="$PROJECT_DIR/src/main/resources/application.yml"
    if [[ -f "$yml" ]]; then
        local port
        port=$(grep "port:" "$yml" 2>/dev/null | head -1 | awk '{print $2}' | xargs)
        [[ -n "$port" ]] && echo "$port" && return
    fi

    echo "8080"  # Valeur par défaut universelle
}

# ── Auto-détection de l'auteur depuis git ────────────────────────────────────
detect_author() {
    if [[ -z "$AUTHOR_NAME" ]]; then
        AUTHOR_NAME="$(git config user.name 2>/dev/null || echo 'unknown')"
    fi
    if [[ -z "$AUTHOR_EMAIL" ]]; then
        AUTHOR_EMAIL="$(git config user.email 2>/dev/null || echo 'unknown')"
    fi
}

# ── Résolution des valeurs ────────────────────────────────────────────────────
cd "$PROJECT_DIR"

[[ -z "$APP_NAME" ]]      && APP_NAME="$(detect_app_name)"
[[ -z "$APP_PORT" ]]      && APP_PORT="$(detect_port)"
detect_author

BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
GIT_REVISION="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"

# Construction du nom complet de l'image
if [[ "$REGISTRY" == "docker.io" ]]; then
    FULL_IMAGE="${DOCKER_USERNAME}/${APP_NAME}"
else
    FULL_IMAGE="${REGISTRY}/${DOCKER_USERNAME}/${APP_NAME}"
fi

LATEST_TAG="latest"

# ── Vérifications ─────────────────────────────────────────────────────────────
log_step "Vérification des prérequis"

[[ -z "$DOCKER_USERNAME" ]] && die "DOCKER_USERNAME non défini. Utilisez -u ou exportez la variable."

if ! command -v docker &>/dev/null; then
    die "Docker n'est pas installé ou n'est pas dans le PATH"
fi

if ! $PUSH_ONLY; then
    [[ -f "$DOCKERFILE" ]] || die "Dockerfile introuvable : $PROJECT_DIR/$DOCKERFILE"
fi

# Détection buildx pour multi-plateforme
if [[ -n "$PLATFORM" ]]; then
    if ! docker buildx version &>/dev/null; then
        die "docker buildx est requis pour --platform. Installez BuildKit."
    fi
    BUILD_CMD="docker buildx build --load"
else
    BUILD_CMD="docker build"
fi

log_success "Prérequis OK"

# ── Résumé ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║          Build & Push Docker — Image universelle             ║${NC}"
echo -e "${BOLD}${BLUE}╠══════════════════════════════════════════════════════════════╣${NC}"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Image"    "$FULL_IMAGE"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Version"  "$VERSION"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Tags"     "${VERSION}, ${LATEST_TAG}"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Registry" "$REGISTRY"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Auteur"   "${AUTHOR_NAME} <${AUTHOR_EMAIL}>"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Git"      "${GIT_BRANCH} @ ${GIT_REVISION}"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Port"     "$APP_PORT"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Platform" "${PLATFORM:-native}"
printf "${BOLD}${BLUE}║${NC}  %-14s ${CYAN}%-45s${BOLD}${BLUE}║${NC}\n" "Cache"    "${NO_CACHE_FLAG:---no-cache (désactivé)}"
$DRY_RUN   && printf "${BOLD}${BLUE}║${NC}  ${YELLOW}%-58s${BOLD}${BLUE}║${NC}\n" "MODE : DRY-RUN (aucune commande exécutée)"
$BUILD_ONLY && printf "${BOLD}${BLUE}║${NC}  ${YELLOW}%-58s${BOLD}${BLUE}║${NC}\n" "MODE : BUILD ONLY (pas de push)"
$PUSH_ONLY  && printf "${BOLD}${BLUE}║${NC}  ${YELLOW}%-58s${BOLD}${BLUE}║${NC}\n" "MODE : PUSH ONLY (pas de build)"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Build ─────────────────────────────────────────────────────────────────────
if ! $PUSH_ONLY; then
    log_step "Build de l'image Docker"
    BUILD_START=$(date +%s)

    PLATFORM_FLAG=""
    [[ -n "$PLATFORM" ]] && PLATFORM_FLAG="--platform $PLATFORM"

    run "$BUILD_CMD -f $DOCKERFILE $NO_CACHE_FLAG $PLATFORM_FLAG \
        --label 'org.opencontainers.image.version=${VERSION}' \
        --label 'org.opencontainers.image.created=${BUILD_DATE}' \
        --label 'org.opencontainers.image.revision=${GIT_REVISION}' \
        --label 'org.opencontainers.image.source=https://github.com/${DOCKER_USERNAME}/${APP_NAME}' \
        --label 'org.opencontainers.image.authors=${AUTHOR_NAME} <${AUTHOR_EMAIL}>' \
        -t '${FULL_IMAGE}:${VERSION}' \
        -t '${FULL_IMAGE}:${LATEST_TAG}' \
        ."

    BUILD_END=$(date +%s)
    BUILD_DURATION=$((BUILD_END - BUILD_START))
    log_success "Build réussi en ${BUILD_DURATION}s"

    # Vérification de l'image
    if ! $DRY_RUN; then
        echo ""
        log_info "Vérification de l'image générée :"
        docker image inspect "${FULL_IMAGE}:${VERSION}" \
            --format='  → Taille : {{.Size}} bytes | Créée le : {{.Created}}' 2>/dev/null || true
    fi

    # Nettoyage des couches intermédiaires
    echo ""
    log_step "Nettoyage des images intermédiaires"
    run "docker image prune --filter 'label=stage=builder' -f" 2>/dev/null || true
    log_success "Nettoyage effectué"
fi

# ── Push ──────────────────────────────────────────────────────────────────────
if ! $BUILD_ONLY; then
    # Confirmation avant push (sauf -y ou dry-run)
    if ! $ASSUME_YES && ! $DRY_RUN; then
        echo ""
        read -r -p "$(echo -e "${YELLOW}Pousser ${FULL_IMAGE}:${VERSION} vers ${REGISTRY} ? [o/N] ${NC}")" CONFIRM
        [[ "$CONFIRM" =~ ^[oOyY]$ ]] || { log_warn "Push annulé."; exit 0; }
    fi

    log_step "Connexion au registry : $REGISTRY"
    if [[ "$REGISTRY" == "docker.io" ]]; then
        run "docker login"
    else
        run "docker login '$REGISTRY'"
    fi

    log_step "Push vers $REGISTRY"
    run "docker push '${FULL_IMAGE}:${VERSION}'"
    run "docker push '${FULL_IMAGE}:${LATEST_TAG}'"
    log_success "Push réussi !"

    # ── Résumé final ─────────────────────────────────────────────────────────
    echo ""
    if [[ "$REGISTRY" == "docker.io" ]]; then
        log_success "Image publiée : https://hub.docker.com/r/${DOCKER_USERNAME}/${APP_NAME}"
    else
        log_success "Image publiée : ${FULL_IMAGE}:${VERSION}"
    fi

    echo ""
    echo -e "${BOLD}${BLUE}─── Commandes de déploiement ────────────────────────────────${NC}"
    echo ""
    echo "  # Récupérer l'image"
    echo "  docker pull ${FULL_IMAGE}:${VERSION}"
    echo ""
    echo "  # Lancer le conteneur"
    echo "  docker run -d \\"
    echo "    --name ${APP_NAME} \\"
    echo "    --env-file .env \\"
    echo "    -p ${APP_PORT}:${APP_PORT} \\"
    echo "    --restart unless-stopped \\"
    echo "    ${FULL_IMAGE}:${LATEST_TAG}"
    echo ""
    echo "  # Mettre à jour (rolling update)"
    echo "  docker pull ${FULL_IMAGE}:${LATEST_TAG} && \\"
    echo "  docker stop ${APP_NAME} && docker rm ${APP_NAME} && \\"
    echo "  docker run -d --name ${APP_NAME} --env-file .env \\"
    echo "    -p ${APP_PORT}:${APP_PORT} --restart unless-stopped ${FULL_IMAGE}:${LATEST_TAG}"
    echo ""
fi

echo -e "${GREEN}${BOLD}✔  Processus terminé !${NC}"
