FROM node:lts-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /app/dist /usr/share/nginx/html

ENV BACKEND_URL='http://124.223.97.89:8848/'
WORKDIR /etc/nginx/
COPY ./nginx.conf.template .
RUN envsubst < ./nginx.conf.template > ./nginx.conf

WORKDIR /app