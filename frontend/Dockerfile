FROM node:latest

# Create app directory
WORKDIR /usr/src/app/frontend

# Copy package json and install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port to access server
# EXPOSE 8080

# Command to run our app
CMD [ "npm", "start" ]

# Sources:
# - https://siddharth-lakhara.medium.com/dockerizing-a-full-stack-js-app-ceb99411996e
# - https://nodejs.org/en/docs/guides/nodejs-docker-webapp/