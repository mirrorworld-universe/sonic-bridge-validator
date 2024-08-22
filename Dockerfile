# Common build stage
FROM node:18.16-alpine3.16

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3060

RUN npm run build
CMD [ "npm", "run", "start:prod" ]
