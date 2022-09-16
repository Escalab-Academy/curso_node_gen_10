FROM node:16-alpine

WORKDIR /app

COPY . ./

RUN npm ci --omit=dev

CMD ["npm", "run", "start"]
