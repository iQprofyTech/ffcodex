FROM node:20-alpine AS build
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
RUN npm i && npm run build

FROM nginx:alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY infra/nginx/frontend-nginx.conf /etc/nginx/conf.d/default.conf
