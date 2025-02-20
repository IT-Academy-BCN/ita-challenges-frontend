FROM nginx:stable-alpine

# Copiar la configuración de Nginx
COPY ["nginx_conf/nginx.conf", "/etc/nginx/nginx.conf"]

# Copiar la build del frontend
ADD ["dist/ita-challenges-frontend/browser/*", "/usr/share/nginx/html/"]

# Asegurar que TinyMCE está dentro de la imagen
ADD ["dist/ita-challenges-frontend/browser/assets/tinymce", "/usr/share/nginx/html/assets/tinymce"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]