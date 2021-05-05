FROM node:alpine
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]
