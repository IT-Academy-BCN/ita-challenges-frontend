FROM nginx:stable-alpine
COPY nginx_conf/nginx.conf /etc/nginx/nginx.conf
COPY dist/ita-challenges-frontend/* /usr/share/nginx/html/
#ADD ["dist/ita-challenges-frontend/*", "/usr/share/nginx/html/"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]