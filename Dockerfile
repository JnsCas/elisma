FROM node:18-alpine as builder

ARG SERVER_PORT
RUN test -n "${SERVER_PORT}" || (echo "PORT not set" && false)

RUN apk --no-cache --update add dumb-init curl \
  && rm -rf /var/cache/apk/*

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# then copy out the notification service
WORKDIR /build

COPY package.json /build
COPY package-lock.json /build
COPY src /build/src
COPY tsconfig.json /build

# then build it.
RUN NODE_ENV=development npm install
RUN npx tsc
RUN npm prune --omit=dev

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --from=0 /wait /wait
COPY --from=builder  /build/dist /app/src
COPY --from=builder  /build/node_modules /app/node_modules
COPY --from=builder  /build/package.json /app/package.json
COPY --from=builder  /build/tsconfig.json /app/tsconfig.json

USER node
EXPOSE $SERVER_PORT
CMD [ "npm", "run", "start" ]
