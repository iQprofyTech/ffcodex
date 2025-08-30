FROM node:20-alpine AS base
ARG WORKDIR
WORKDIR /usr/src/app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps

# Install TypeScript once at root for building shared
RUN npm i -D typescript && \
    npm -w packages/shared i && npm -w packages/shared run build && \
    npm -w apps/backend i && npm -w apps/backend run build && \
    npm -w apps/worker i && npm -w apps/worker run build || true

WORKDIR /usr/src/app/${WORKDIR}
# Default command can be overridden per-service
CMD ["node","dist/index.js"]
