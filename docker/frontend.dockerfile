# Use the official Node.js image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm 10.0.0
RUN npm install -g npm@10.0.0

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
