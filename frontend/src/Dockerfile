FROM node:current-slim

WORKDIR /frontend
COPY . .

RUN npm i

EXPOSE 5173

CMD [ "npm", "run", "dev" ]