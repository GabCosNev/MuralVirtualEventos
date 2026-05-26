# =========================
# Etapa 1 — Build
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências exatamente como no lockfile
RUN npm ci

# Copia Prisma
COPY prisma ./prisma

# Gera Prisma Client
RUN npx prisma generate

# Copia restante da aplicação
COPY . .

# Build NestJS
RUN npx nest build


# =========================
# Etapa 2 — Produção
# =========================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copia arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
