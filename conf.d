sudo tee /etc/nginx/conf.d/stenford.monster.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name stenford.monster;

    location / {
        proxy_pass http://127.0.0.1:5042;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
