# Imagen base con Node 18
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY ../../frontend/TestlyCRUD/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el frontend
COPY ../../frontend/TestlyCRUD .

# Construir la app
RUN npm run build

# Servir la app
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
