FROM node:24-alpine

WORKDIR /app

COPY ./ .

RUN npm install --include=dev

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
