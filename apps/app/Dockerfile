# FROM node:18-alpine

# WORKDIR /app

# COPY web/package.json web/pnpm-lock.yaml ./

# RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

# RUN pnpm i

# COPY web .

# RUN pnpm build

# EXPOSE 5173

# CMD ["pnpm", "dev"]# Usa imagem base Node
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy root package.json and lockfile
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

# Copy the app package.json
COPY apps/app/package.json ./apps/app/package.json

RUN pnpm install --filter ./apps/app...

# Copy app source
COPY . .

EXPOSE 5173

CMD [ "pnpm", "dev" ]