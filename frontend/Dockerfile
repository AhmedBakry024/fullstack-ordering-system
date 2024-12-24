FROM node:18-alpine

WORKDIR /app

COPY package.json .

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change permissions of the /app directory to allow read, write, and execute for all users
RUN chmod -R 777 /app

# Switch to the non-root user
USER appuser

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the non-root user has permissions for all files and directories
RUN chmod -R 777 /app

EXPOSE 5173

CMD [ "npm", "run", "dev" ]