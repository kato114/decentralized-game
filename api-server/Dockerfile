FROM node:16.13.2-alpine3.14 as base
################################################################################

FROM base as build
LABEL website="Secure Docker Images https://secureimages.dev"
LABEL description="We secure your business from scratch"
LABEL maintainer="support@secureimages.dev"

ARG CI=true

# Receive input from Azure Pipelines
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN echo build NODE_ENV: $NODE_ENV

RUN apk add --no-cache bash git ca-certificates build-base python3 &&\
    rm -rf /var/cache/apk/* /tmp/*

WORKDIR /app-temp

# Include all files for typescript build to succeed in Docker
COPY . .

RUN npm install --production=false && \
#    npm audit --audit-level=high && \
    npm run build

# web3 1.5.2 affected https://www.npmjs.com/advisories/877/versions , so we use 1.5.2-rc.0
# RUN npm outdated || true

# Copy the compiled output to be run
RUN mkdir -p ../app/dist
RUN cp -r ./dist ../app
RUN cp -r ./node_modules ../app
RUN cp ./package.json ../app

WORKDIR /app

RUN ls -l && cd ./dist && ls -l

# CMD ["sleep", "3d"]
################################################################################

FROM base as runtime
LABEL website="Secure Docker Images https://secureimages.dev"
LABEL description="We secure your business from scratch"
LABEL maintainer="support@secureimages.dev"

# This just clears the Cache for the proceeding RUN commands, so the RUN values below update every time
ARG TEST

# Receive NODE_ENV from --build-arg
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV \
    PORT=5000 \
    PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN echo runtime NODE_ENV: $NODE_ENV
RUN env

# used for Puppeteer headless browser
RUN apk add --no-cache chromium

WORKDIR /app

RUN ln -sf /dev/stdout /app/server.log &&\
    chown -R node:node /app/server.log

COPY --from=build --chown=node:node /app .

USER node

CMD ["npm", "run", "start:production"]
