# Imagen base con Node 18
FROM node:18-alpine

WORKDIR /app

# Instalar Expo CLI global
RUN npm install -g expo-cli

# Copiar package.json y package-lock.json
COPY ../../mobile/TestlyAppMobile/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY ../../mobile/TestlyAppMobile .

# Exponer puerto Metro
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Comando para arrancar Expo
CMD ["expo", "start", "--tunnel"]
