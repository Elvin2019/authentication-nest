# Base image
FROM node:21

ENV NODE_ENV=production  

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN yarn cache clean

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
# RUN apt-get update -y  
# RUN apt-get install -y iputils-ping

RUN yarn build
EXPOSE 4001
# Start the server using the production build
CMD [ "node", "dist/main.js" ]
