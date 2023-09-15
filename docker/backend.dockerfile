# Use the latest Node.js image as the base image
FROM node:latest

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the latest version of npm and install the dependencies
RUN npm install -g npm@latest && npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose port 3001 for the application
EXPOSE 3001

# Start the application
CMD ["npm", "start"]