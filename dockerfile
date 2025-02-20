FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/src/db.json /app/src/db.json  

EXPOSE 50016 3001  

ARG MODE=prod
ENV MODE=${MODE}

# CMD ["sh", "-c", "cp -r /app/node_modules", "if [ \"$MODE\" = \"dev\" ]; then npm run start:dev; else npm run start:prod; fi"]
CMD sh -c "cp -r /app/node_modules /app_host/node_modules 2>/dev/null || true && \
   if [ \"$MODE\" = \"dev\" ]; then npm run start:dev; else npm run start:prod; fi"