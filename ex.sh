#!/bin/bash

set -e

ACTION="$1"
BRANCH="$2"

DOMAIN="${BRANCH}.beta.pets-example.ru"

WWW_ROOT="/var/www/features/${BRANCH}"

CONF="/etc/nginx/sites-available/beta-${BRANCH}.conf"

LINK="/etc/nginx/sites-enabled/beta-${BRANCH}.conf"

BACKEND="backend-${BRANCH}"

create() {

    mkdir -p "${WWW_ROOT}"

cat > "${CONF}" <<EOF
server {

    listen 80;

    server_name ${DOMAIN};

    root ${WWW_ROOT};

    index index.html;

    location / {

        try_files \$uri \$uri/ /index.html;

    }

    location /api/ {

        proxy_pass http://${BACKEND}:3000/;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;

        proxy_set_header X-Real-IP \$remote_addr;

        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto \$scheme;

    }

}
EOF

    ln -sf "${CONF}" "${LINK}"

    nginx -t

    systemctl reload nginx
}

delete_env() {

    rm -rf "${WWW_ROOT}"

    rm -f "${LINK}"

    rm -f "${CONF}"

    docker rm -f "${BACKEND}" 2>/dev/null || true

    nginx -t

    systemctl reload nginx
}

case "$ACTION" in

create)

    create

    ;;

delete)

    delete_env

    ;;

*)

    echo "Usage: beta-env.sh create|delete branch"

    exit 1

esac