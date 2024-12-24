FROM node:20-alpine

WORKDIR /app

RUN adduser node root
RUN chmod -R 775 /app
RUN chown -R node:root /app

USER 1000

COPY . .

EXPOSE 5173

CMD [ "npx", "vite" ]