FROM node:16.13.0-alpine3.14 as base

####################################
# First build
####################################
FROM base as build

ARG CI=true

# Receive APP_ENV from --build-arg
# Default to production mode
ARG APP_ENV=production
ENV APP_ENV=$APP_ENV
LABEL website="Decentral Games Website - $APP_ENV"

# Receive NODE_ENV from --build-arg - NOTE: Can only be "test", "development" or "production" per NextJS config rules
# Default to production mode
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN echo "build APP_ENV: $APP_ENV"
RUN echo "build NODE_ENV: $NODE_ENV"

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Install python build tools
RUN apk add --update --no-cache python3 build-base && \
    rm -rf /var/cache/apk/* && \
    npm install --production=false --legacy-peer-deps && \
    npm audit --level critical || true && \
#    npm run lint && \
    npx next telemetry disable && \
    env && \
    npm run build:$APP_ENV # Build For Proper Env

####################################
# Second build - This is the deployed docker image
####################################

FROM base as runtime
LABEL website="Decentral Games Website - $APP_ENV"

# This just clears the Cache for the proceeding RUN commands, so the RUN values below update every time
ARG TEST

# Receive from previous build stage
ARG APP_ENV
ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV \
    PATH="/app/node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
    APP_ENV=$APP_ENV

RUN echo "runtime APP_ENV: $APP_ENV"
RUN env

WORKDIR /app

COPY --from=build --chown=node:node /app .

USER node

EXPOSE 3000

CMD ["npm", "run", "start:production"]
