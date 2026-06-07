FROM node:22-bookworm-slim AS build
WORKDIR /app
ARG VUE_APP_UNSPLASH_ACCESS_KEY
ENV VUE_APP_UNSPLASH_ACCESS_KEY=$VUE_APP_UNSPLASH_ACCESS_KEY
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
