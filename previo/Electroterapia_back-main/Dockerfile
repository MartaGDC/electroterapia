# Imagen base
FROM node:18

# Carpeta de trabajo en el contenedor
WORKDIR /app

# Copiar archivos
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto en el que corre el servidor
EXPOSE 8080

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
