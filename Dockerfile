FROM node:16-alpine as ts-build

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./

RUN yarn install 

COPY src ./src

RUN yarn build

RUN npm prune --production

##Stage 2
FROM node:16-alpine as ts-remover

WORKDIR /usr/src/app

COPY --from=ts-build /usr/src/app/dist/tsc .
COPY --from=ts-build /usr/src/app/package.json .
COPY --from=ts-build /usr/src/app/yarn.lock .

RUN yarn install --production=true

##Stage 3
FROM gcr.io/distroless/nodejs:latest@sha256:78ceb4615881ba1281b7c8a024befce00a97af6b022e38e09a30873eb544f430

WORKDIR /usr/app

COPY --from=ts-remover /usr/src/app ./

USER 1000

CMD ["index.js"]
