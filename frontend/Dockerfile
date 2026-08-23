FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json angular.json tsconfig*.json ./
RUN npm ci
COPY src ./src
COPY public ./public
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist/wholesome-path/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
