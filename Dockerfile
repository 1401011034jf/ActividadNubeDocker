
# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar el código fuente
COPY src/ ./src/

# Configurar el puerto
EXPOSE 3000

# Entorno de producción
ENV NODE_ENV=production

# Iniciar la aplicación
CMD ["npm", "start"]
