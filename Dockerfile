FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock* ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
