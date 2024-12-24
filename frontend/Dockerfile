FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of the /app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser


RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]