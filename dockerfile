FROM node:14

WORKDIR /app
COPY . /app

RUN npm install
RUN chmod +x ./sequelize-execute.sh
CMD node index.js
