# ==========================================
# Etapa 1: Compilación del Frontend (React + Vite)
# ==========================================
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

# ==========================================
# Etapa 2: Backend NestJS y Servidor Final
# ==========================================
FROM node:20-slim
WORKDIR /app

# Copiar dependencias y configuración de npm
COPY package*.json .npmrc* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Traer el frontend compilado a frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "dist/main"]
