FROM node:20-alpine

WORKDIR /app


COPY dist ./dist

RUN npm install -g serve

EXPOSE 5173

CMD [ "serve", "-s", "." ]