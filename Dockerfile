FROM node:8

# Setup the project directory
RUN mkdir -p /opt/project
WORKDIR /opt/project

# Setup the application dependencies
COPY package*.json /opt/project/
RUN npm install

# Setup the application code
COPY app /opt/project/app

