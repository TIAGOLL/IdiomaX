FROM node:18-alpine

WORKDIR /app

COPY web/package.json web/pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@9.11.0 --activate

RUN pnpm i

COPY web .

RUN pnpm build

EXPOSE 5173

CMD ["pnpm", "dev"]
