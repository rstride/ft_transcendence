# Use Node.js image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install -g npm@10.0.0

# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]
