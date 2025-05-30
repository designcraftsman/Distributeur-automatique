FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install -g nodemon && npm install

EXPOSE 4200

CMD ["nodemon", "server"]