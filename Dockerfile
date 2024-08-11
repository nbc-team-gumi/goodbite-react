# Step 1: Build the React app
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

ARG REACT_APP_API_BASE_URL
RUN REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL} npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
