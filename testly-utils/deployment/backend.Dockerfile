# Imagen base con Java 17
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiamos el pom y el src
COPY ../../backend/TestlyAPIBackend/pom.xml .
COPY ../../backend/TestlyAPIBackend/src ./src

# Instalamos Maven y construimos
RUN apk add --no-cache maven && mvn package

# Exponemos puerto
EXPOSE 8081

# Comando para arrancar la API
CMD ["java", "-jar", "target/TestlyAPIBackend-0.0.1-SNAPSHOT.jar"]
