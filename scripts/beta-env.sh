#!/usr/bin/env bash

set -Eeuo pipefail

ACTION="${1:-}"
BRANCH="${2:-}"
IMAGE="${3:-}"

SERVER_IP="138.16.226.144"

BASE_DIR="/opt/pets"
COMPOSE_FILE="${BASE_DIR}/compose.beta.yaml"
COMMON_ENV="${BASE_DIR}/beta.env"

WWW_BASE="/var/www/features"

NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

die() {
    echo "ERROR: $*" >&2
    exit 1
}

validate_branch() {
    [[ -n "${BRANCH}" ]] || die "Branch slug is required"

    # Поддерживаем только безопасные значения:
    # feature-dogs, fix-auth, feat-new-card
    [[ "${BRANCH}" =~ ^[a-z0-9][a-z0-9-]{0,62}$ ]] \
        || die "Invalid branch slug: ${BRANCH}"

    [[ "${BRANCH}" != *- ]] \
        || die "Branch slug must not end with '-'"
}

check_server_files() {
    [[ -f "${COMPOSE_FILE}" ]] \
        || die "Compose file not found: ${COMPOSE_FILE}"

    [[ -f "${COMMON_ENV}" ]] \
        || die "Environment file not found: ${COMMON_ENV}"
}

validate_branch

PROJECT="beta-${BRANCH}"
DOMAIN="${BRANCH}.${SERVER_IP}.sslip.io"

WWW_ROOT="${WWW_BASE}/${BRANCH}"

CONF="${NGINX_AVAILABLE}/beta-${BRANCH}.conf"
LINK="${NGINX_ENABLED}/beta-${BRANCH}.conf"

# Для deploy сюда передаётся настоящий image.
# Для status/delete достаточно placeholder: image не скачивается.
compose() {
    local image_value="${IMAGE:-placeholder}"

    BACKEND_IMAGE="${image_value}" \
    docker compose \
        -p "${PROJECT}" \
        --env-file "${COMMON_ENV}" \
        -f "${COMPOSE_FILE}" \
        "$@"
}

backend_exists() {
    local container_id

    container_id="$(compose ps -q backend 2>/dev/null || true)"

    [[ -n "${container_id}" ]]
}

get_backend_port() {
    local endpoint
    local port

    endpoint="$(compose port backend 5000 2>/dev/null | tail -n 1)"

    [[ -n "${endpoint}" ]] \
        || die "Cannot determine backend port for ${BRANCH}"

    port="${endpoint##*:}"

    [[ "${port}" =~ ^[0-9]+$ ]] \
        || die "Invalid backend port: ${port}"

    echo "${port}"
}

write_nginx_config() {
    local backend_port="${1:-}"
    local temp_conf
    local backup_conf=""

    temp_conf="$(mktemp)"

    {
        cat <<EOF
server {
    listen 80;

    server_name ${DOMAIN};

    root ${WWW_ROOT};
    index index.html;

EOF

        if [[ -n "${backend_port}" ]]; then
            cat <<EOF
    location /api/ {
        proxy_pass http://127.0.0.1:${backend_port};

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

EOF
        fi

        cat <<'EOF'
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
    } > "${temp_conf}"

    # Сохраняем предыдущую конфигурацию на случай ошибки nginx.
    if [[ -f "${CONF}" ]]; then
        backup_conf="$(mktemp)"
        cp -a "${CONF}" "${backup_conf}"
    fi

    install -m 0644 "${temp_conf}" "${CONF}"
    ln -sfn "${CONF}" "${LINK}"

    if ! nginx -t; then
        echo "Nginx configuration is invalid. Restoring previous config." >&2

        rm -f "${LINK}"

        if [[ -n "${backup_conf}" ]]; then
            install -m 0644 "${backup_conf}" "${CONF}"
            ln -sfn "${CONF}" "${LINK}"
        else
            rm -f "${CONF}"
        fi

        nginx -t || true

        rm -f "${temp_conf}"

        if [[ -n "${backup_conf}" ]]; then
            rm -f "${backup_conf}"
        fi

        die "Nginx configuration update failed"
    fi

    systemctl reload nginx

    rm -f "${temp_conf}"

    if [[ -n "${backup_conf}" ]]; then
        rm -f "${backup_conf}"
    fi
}

create_site() {
    mkdir -p "${WWW_ROOT}"

    if backend_exists; then
        local backend_port
        backend_port="$(get_backend_port)"

        write_nginx_config "${backend_port}"
    else
        # Пока backend не создан, frontend всё равно сможет открыться.
        write_nginx_config ""

        echo "WARNING: backend for ${BRANCH} does not exist yet"
    fi

    echo "BETA_URL=http://${DOMAIN}"
}

deploy_backend() {
    [[ -n "${IMAGE}" ]] \
        || die "Backend image is required"

    check_server_files

    mkdir -p "${WWW_ROOT}"

    echo "Deploying beta backend"
    echo "Branch:  ${BRANCH}"
    echo "Project: ${PROJECT}"
    echo "Image:   ${IMAGE}"

    compose pull backend

    compose up \
        -d \
        --wait \
        --wait-timeout 120 \
        --remove-orphans

    local backend_port
    backend_port="$(get_backend_port)"

    write_nginx_config "${backend_port}"

    echo
    echo "Beta backend deployed successfully"
    echo "BACKEND_PORT=${backend_port}"
    echo "BETA_URL=http://${DOMAIN}"
    echo "API_URL=http://${DOMAIN}/api"
}

show_status() {
    check_server_files

    echo "Branch:  ${BRANCH}"
    echo "Project: ${PROJECT}"
    echo "URL:     http://${DOMAIN}"
    echo

    compose ps

    if backend_exists; then
        local backend_port
        backend_port="$(get_backend_port)"

        echo
        echo "BACKEND_PORT=${backend_port}"
        echo "API_URL=http://${DOMAIN}/api"
    else
        echo
        echo "Backend is not deployed"
    fi
}

delete_environment() {
    check_server_files

    echo "Deleting beta environment: ${BRANCH}"

    # Удаляет backend, PostgreSQL, network и volume этой ветки.
    compose down \
        -v \
        --remove-orphans || true

    rm -rf "${WWW_ROOT}"

    rm -f "${LINK}"
    rm -f "${CONF}"

    nginx -t
    systemctl reload nginx

    echo "Beta environment deleted: ${BRANCH}"
}

case "${ACTION}" in
    site)
        create_site
        ;;

    deploy-backend)
        deploy_backend
        ;;

    exists)
        check_server_files
        backend_exists
        ;;

    status)
        show_status
        ;;

    delete)
        delete_environment
        ;;

    *)
        cat >&2 <<EOF
Usage:

  beta-env.sh site <branch-slug>

  beta-env.sh deploy-backend <branch-slug> <docker-image>

  beta-env.sh exists <branch-slug>

  beta-env.sh status <branch-slug>

  beta-env.sh delete <branch-slug>
EOF
        exit 1
        ;;
esac