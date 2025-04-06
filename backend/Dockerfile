FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to take advantage of Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy the rest of your application files
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the app
CMD ["node", "server.js"]
