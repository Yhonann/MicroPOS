# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose API port
EXPOSE 4000
EXPOSE 5672


# Start the application
CMD ["npm", "start"]
