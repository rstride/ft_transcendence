# Use the latest stable version of Node.js
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm version 10.0.0 (if you specifically need this version)
RUN npm install -g npm@latest

# Install dependencies
RUN npm install 

# Copy the rest of the code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
