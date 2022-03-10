FROM node:latest AS build
WORKDIR /app
ADD package.json .
RUN npm install
ADD . .

FROM node:latest
COPY --from=build /app .
EXPOSE 3000
CMD ["node", "index.js"]
