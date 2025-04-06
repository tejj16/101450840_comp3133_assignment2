# Stage 1: Build the Angular app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve with nginx
FROM nginx:alpine
# Copy the build artifacts from the build stage
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
