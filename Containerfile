FROM docker.io/oven/bun:1 AS dependencies

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


FROM dependencies AS builder

WORKDIR /app

COPY . .

RUN bun run build


FROM docker.io/oven/bun:1-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/content ./content

# Copy common build output directories if they exist.
COPY --from=builder /app/dist ./dist

EXPOSE 8943

CMD ["bun", "run", "start"]
