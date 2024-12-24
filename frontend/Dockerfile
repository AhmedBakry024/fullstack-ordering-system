FROM node:18-alpine

WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json and install dependencies as root user
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code as root user
COPY . .

# Change ownership of the /app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

EXPOSE 5173

CMD [ "npm", "run", "dev" ]