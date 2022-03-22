FROM node:16

WORKDIR /usr/src/clean-ts-api

# Pega o package.json e joga dentro da raiz do projeto no container
COPY ./package.json .

RUN npm install --only=production