# Imagen base
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Construir la app si usas React/Vite/Ionic
RUN npm run build

# Usar NGINX para servir la app
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
