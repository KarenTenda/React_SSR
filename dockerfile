FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json

# how to make it check if models and datasets folders otherwise create them?
# COPY --from=builder /app/models models
# COPY --from=builder /app/datasets datasets


CMD ["npm", "run", "start"]
