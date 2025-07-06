# Dockerfile para Angular producción
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/quri-web-app/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
