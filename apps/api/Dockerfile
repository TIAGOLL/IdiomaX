# api.Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY api/package.json api/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

RUN pnpm i

COPY api ./

RUN pnpm build

EXPOSE 3030

EXPOSE 5555
