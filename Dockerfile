ARG NODE_VERSION=24.20.0
FROM node:${NODE_VERSION}-bookworm-slim

# Some npm packages compile native extensions during installation.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app

# Webpack 4 needs the legacy crypto provider with modern Node releases.
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY --chown=node:node package.json package-lock.json .npmrc ./
USER node
RUN npm ci --no-audit --no-fund

COPY --chown=node:node . .
RUN chmod +x /app/docker/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["sh", "/app/docker/entrypoint.sh"]
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "8080"]
