#!/bin/bash

echo "======================================"
echo "       FLASK BACKEND DEPLOYER         "
echo "======================================"

# ===============================
# Pindah ke folder backend
# ===============================
if [ ! -d "backend" ]; then
    echo "❌ Folder backend tidak ditemukan! Pastikan script ini ada di root project."
    exit 1
fi

cd backend

# ===============================
# Ask inputs
# ===============================
read -p "Nama service systemd (contoh: tubesaka-backend): " SERVICE_NAME
read -p "Domain/subdomain backend (contoh: api.tubesaka.keispace.cloud): " BACKEND_DOMAIN
read -p "Database URL: " DATABASE_URL
read -p "Port backend (kosongkan untuk auto): " INPUT_PORT

# ===============================
# Cari port kosong
# ===============================
if [ -z "$INPUT_PORT" ]; then
    echo "Mencari port kosong untuk backend..."
    for PORT in {5000..5999}; do
        if ! lsof -Pi :$PORT -sTCP:LISTEN >/dev/null; then
            BACKEND_PORT=$PORT
            echo "✓ Port kosong ditemukan: $BACKEND_PORT"
            break
        fi
    done
else
    BACKEND_PORT=$INPUT_PORT
fi

# ===============================
# Generate SECRET_KEY
# ===============================
SECRET_KEY=$(openssl rand -hex 32)
echo "✓ SECRET_KEY digenerate"

# ===============================
# Membuat file .env
# ===============================
echo "Membuat file .env ..."
cat > .env <<EOF
FLASK_ENV=production
SECRET_KEY=$SECRET_KEY
DATABASE_URL=$DATABASE_URL
PORT=$BACKEND_PORT
EOF

echo "✓ File .env dibuat"

# ===============================
# Install dependencies
# ===============================
echo "Install python packages..."
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# ===============================
# Membuat systemd service
# ===============================
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"

echo "Membuat service systemd..."

cat > $SERVICE_FILE <<EOF
[Unit]
Description=$SERVICE_NAME Flask Backend using Gunicorn
After=network.target

[Service]
User=root
WorkingDirectory=$(pwd)
EnvironmentFile=$(pwd)/.env
ExecStart=$(pwd)/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:$BACKEND_PORT wsgi:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl restart $SERVICE_NAME

echo "✓ Service backend berjalan"

# ===============================
# Setup Nginx
# ===============================
NGINX_FILE="/etc/nginx/sites-available/$SERVICE_NAME"

echo "Menulis file Nginx..."

cat > $NGINX_FILE <<EOF
server {
    server_name $BACKEND_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/$BACKEND_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$BACKEND_DOMAIN/privkey.pem;
}

server {
    listen 80;
    server_name $BACKEND_DOMAIN;
    return 301 https://$BACKEND_DOMAIN\$request_uri;
}
EOF

ln -sf $NGINX_FILE /etc/nginx/sites-enabled/$SERVICE_NAME
nginx -t && systemctl restart nginx

echo "======================================"
echo " BACKEND Flask berhasil dideploy!"
echo " Domain: https://$BACKEND_DOMAIN"
echo " Port internal: $BACKEND_PORT"
echo "======================================"
