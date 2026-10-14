# Neutorium CMS (Strapi 5). Build: docker build -t neutorium-cms ./cms
FROM node:22-alpine AS build
RUN apk add --no-cache build-base python3 vips-dev
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache vips
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
RUN npm prune --omit=dev && chown -R node:node /app
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
