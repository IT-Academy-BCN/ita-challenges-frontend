FROM nginx:stable-alpine
COPY ["nginx_conf/nginx.conf", "/etc/nginx/nginx.conf"]
COPY ["nginx_conf/fullchain.pem", "/etc/ssl/certs/fullchain.pem"]
COPY ["nginx_conf/privkey.pem", "/etc/ssl/certs/privkey.pem"]
ADD ["dist/ita-challenges-frontend/*", "/usr/share/nginx/html/"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]