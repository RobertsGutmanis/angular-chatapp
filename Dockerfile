
FROM node:latest as build

WORKDIR /usr/local/app

COPY package*.json /usr/local/app

RUN npm install

COPY ./ /usr/local/app/

CMD ["npm", "run", "build"]

COPY ./ /usr/local/app/

FROM nginx:latest

COPY --from=build /usr/local/app/dist/chatapp /usr/share/nginx/html

EXPOSE 80
