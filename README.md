# Testly - The Trivia Project 🏆

Testly es una plataforma fullstack de cuestionarios y trivias que permite a los usuarios poner a prueba sus conocimientos, realizar seguimiento de sus puntuaciones y competir por el mejor rango.

## 🚀 Estructura del Proyecto

El proyecto está dividido en dos partes principales:

* **/backend**: API REST desarrollada con Java 17 y Spring Boot. Gestiona la autenticación, las preguntas y las estadísticas en bases de datos MongoDB y MySQL.
* **/frontend**: Aplicación SPA desarrollada con React, TypeScript y Vite. Interfaz moderna y responsive utilizando CSS personalizado y React Router.

## 🛠️ Tecnologías utilizadas

### Backend
* **Java 17** con **Spring Boot 3**
* **Spring Security** (Autenticación JWT/Session)
* **Bases de Datos:** MongoDB (Preguntas) y MySQL (Usuarios)
* **Maven** para la gestión de dependencias

### Frontend
* **React 18** con **TypeScript**
* **Vite** (Build tool)
* **React Router Dom** (Navegación)
* **Axios** (Peticiones API)
* **CSS3** con variables personalizadas

## 📦 Instalación y Despliegue

### Requisitos previos
* Java 17+
* Node.js (v18+)
* Docker (opcional, para las bases de datos)

### Ejecución del Backend
1. Entra en la carpeta: `cd backend/TestlyAPIBackend`
2. Ejecuta el proyecto: `./mvnw spring-boot:run`
3. La API estará disponible en `http://localhost:8081`

### Ejecución del Frontend
1. Entra en la carpeta: `cd frontend`
2. Instala dependencias: `npm install`
3. Lanza la app: `npm run dev`
4. La web estará disponible en `http://localhost:5173`

## 📝 Notas de Versión (v0.0)
* Sistema de Login y Registro funcional.
* Navegación integrada en el Navbar.
* Página de "Mi Puntuación" con estadísticas dinámicas.
* Estructura de proyecto organizada y limpia.

---
Creado por [pablo-ruiz-carbonero](https://github.com/pablo-ruiz-carbonero)
