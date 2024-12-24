FROM node:18-alpine

WORKDIR /app

COPY package.json ./

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies as root user
RUN npm install

# Copy the rest of the application code and change ownership to the non-root user
COPY --chown=appuser:appgroup . .

# Switch to the non-root user
USER appuser

EXPOSE 5173

CMD [ "npm", "run", "dev" ]