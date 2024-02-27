FROM nginx:stable-alpine
COPY ["nginx_conf/nginx.conf.default", "/etc/nginx/nginx.conf"]
ADD ["dist/ita-challenges-frontend/*", "/usr/share/nginx/html/"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]