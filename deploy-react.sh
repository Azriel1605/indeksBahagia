#!/bin/bash

echo "======================================"
echo "   REACT / NEXT.JS FRONTEND DEPLOY    "
echo "======================================"

# ===============================
# Pindah ke folder frontend
# ===============================
if [ ! -d "frontend" ]; then
    echo "❌ Folder frontend tidak ditemukan! Pastikan script ini ada di root project."
    exit 1
fi

cd frontend

# ===============================
# Input Variables
# ===============================
read -p "Domain/subdomain frontend (contoh: tubesaka.keispace.cloud): " FRONTEND_DOMAIN
read -p "API URL backend (contoh: https://api.tubesaka.keispace.cloud): " API_URL
read -p "Port frontend (kosongkan untuk auto): " INPUT_PORT
read -p "Nama PM2 process: " PM2_NAME

# ===============================
# Cari port kosong
# ===============================
if [ -z "$INPUT_PORT" ]; then
    echo "Mencari port kosong untuk frontend..."
    for PORT in {3000..3999}; do
        if ! lsof -Pi :$PORT -sTCP:LISTEN >/dev/null; then
            FRONTEND_PORT=$PORT
            echo "✓ Port kosong ditemukan: $FRONTEND_PORT"
            break
        fi
    done
else
    FRONTEND_PORT=$INPUT_PORT
fi

# ===============================
# Create .env.local
# ===============================
echo "Membuat .env.local..."

cat > .env.local <<EOF
NEXT_PUBLIC_API_URL=$API_URL
PORT=$FRONTEND_PORT
EOF

echo "✓ .env.local dibuat"

# ===============================
# Install & Build
# ===============================
echo "Install dependencies..."
npm install

echo "Build frontend..."
npm run build

# ===============================
# PM2 RUN
# ===============================
pm2 delete $PM2_NAME >/dev/null 2>&1
pm2 start "npm start" --name $PM2_NAME -- --port $FRONTEND_PORT
pm2 save

# ===============================
# Nginx config
# ===============================
NGINX_FILE="/etc/nginx/sites-available/$FRONTEND_DOMAIN"

echo "Menulis config Nginx..."

cat > $NGINX_FILE <<EOF
server {
    server_name $FRONTEND_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/$FRONTEND_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$FRONTEND_DOMAIN/privkey.pem;
}

server {
    listen 80;
    server_name $FRONTEND_DOMAIN;
    return 301 https://$FRONTEND_DOMAIN\$request_uri;
}
EOF

ln -sf $NGINX_FILE /etc/nginx/sites-enabled/$FRONTEND_DOMAIN

nginx -t && systemctl restart nginx

echo "======================================"
echo " FRONTEND Next.js berhasil dideploy!"
echo " Domain: https://$FRONTEND_DOMAIN"
echo " Port internal: $FRONTEND_PORT"
echo " PM2 process: $PM2_NAME"
echo "======================================"
