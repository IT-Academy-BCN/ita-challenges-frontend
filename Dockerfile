FROM nginx:stable-alpine

# Copia el archivo de configuración de Nginx
COPY ["nginx_conf/nginx.conf", "/etc/nginx/nginx.conf"]

# Copia los archivos del frontend
ADD ["dist/ita-challenges-frontend/browser/", "/usr/share/nginx/html/"]

# Copia TinyMCE al contenedor
COPY node_modules/tinymce /usr/share/nginx/html/tinymce

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
