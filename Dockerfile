FROM node:12.16.1

RUN mkdir /app
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .

CMD [ "npm", "run", "dev" ]