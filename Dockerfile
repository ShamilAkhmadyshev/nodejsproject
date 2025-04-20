FROM node:14 AS client

WORKDIR /app/client

RUN ls -la

COPY client/package.json /app/client

RUN npm install

COPY client /app/client

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY server/package.json /app

RUN npm install

COPY server /app

COPY --from=client /app/client/build /app/client

EXPOSE 8080

CMD ["npm", "start"]
