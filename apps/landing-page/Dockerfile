FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia os arquivos
COPY . .

# Instala dependências da workspace
RUN pnpm install

# Expõe a porta do Vite
EXPOSE 5174

# Inicia a aplicação pwa com pnpm dev
CMD ["pnpm", "--dir", "apps/landing-page", "dev"]
