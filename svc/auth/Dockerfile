FROM node:18.16.0-slim

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT

EXPOSE $PORT

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN npm i npm@9.5.1 -g

# skaffold 사용 시 권한 오류가 발생한다.
# USER node

WORKDIR /opt/node_app

COPY --chown=node:node package*.json ./

RUN npm ci && npm cache clean --force

ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app

COPY --chown=node:node . .

HEALTHCHECK --interval=30s CMD node /opt/node_app/app/dist/healthcheck.js

WORKDIR /opt/node_app/app

# 개발 환경
CMD ["npm", "start"]

# 운영 환경
# RUN npm run build
# CMD ["node", "dist/main"]