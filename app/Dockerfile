# Developement stage
FROM node:20-alpine AS development

LABEL maintainer.name='christian chisom' maintainer.email='christianchisom278@gmail.com>'

RUN npm install -g nodemon

WORKDIR /app

ENV NODE_ENV="development"

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]

# # Production stage
# FROM node:20-alpine AS production

# WORKDIR /app

# LABEL maintainer.name='christian chisom' maintainer.email='christianchisom278@gmail.com>'

# COPY package*.json .

# RUN npm install

# COPY ./build .

# CMD node index.js
