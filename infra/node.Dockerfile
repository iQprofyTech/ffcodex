FROM node:20-alpine AS base
ARG WORKDIR
WORKDIR /usr/src/app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps ./apps
RUN npm -w packages/shared i --silent || true && npm -w packages/shared run build || true
WORKDIR /usr/src/app/${WORKDIR}
RUN npm i --silent || true
CMD ["npm","run","dev"]

