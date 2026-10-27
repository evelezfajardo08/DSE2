# ==========================================
# Etapa 1: Compilación del Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Etapa 2: Backend NestJS y Servidor Final
# ==========================================
FROM node:20-alpine
WORKDIR /app

# Copiar dependencias y compilar backend
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Traer el frontend compilado a frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Configuración de producción para Cloud Run
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main"]
