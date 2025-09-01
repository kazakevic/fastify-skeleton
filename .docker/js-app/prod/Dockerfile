FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies including devDependencies
COPY package* ./
RUN npm i --include=dev

COPY prisma ./prisma
COPY .env.prod ./.env
RUN cat .env
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript → dist/
RUN npx tsc

# --- Runtime stage ---
FROM node:24-alpine AS production
WORKDIR /app
# Copy only package.json and install prod dependencies
COPY package*.json ./

RUN npm i --omit=dev

# Copy built code from builder
COPY --from=build /app/dist ./dist

# Copy compiled JS + prisma client
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]
