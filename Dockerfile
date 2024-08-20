# Step 1: Build the React app
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_API_KEY_KAKAO
ARG REACT_APP_DOMAIN_URL

ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_API_KEY_KAKAO=${REACT_APP_API_KEY_KAKAO}
ENV REACT_APP_DOMAIN_URL=${REACT_APP_DOMAIN_URL}

RUN npm run build

# Step 2: Serve the app with Node.js
FROM node:20 AS server

WORKDIR /app

# Copy the built React files
COPY --from=build /app/build /app/build

COPY server.js ./

# Install a simple HTTP server like Express
RUN npm install express

EXPOSE 80

CMD ["node", "server.js"]