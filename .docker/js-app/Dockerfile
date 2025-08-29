FROM node:24-alpine

WORKDIR /app

# Install PM2 and nodemon globally
RUN npm install -g pm2 nodemon

# Copy dependency files
COPY ../../package*.json ./

# Install dependencies
RUN npm install

COPY ecosystem.config.js ./

EXPOSE 3000

# Use conditional CMD depending on NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then \
      npm install && npm run prisma:generate && npm run build && npm start; \
    else \
      npm run prisma:generate && \
      npm run build && nodemon --watch dist dist/index.js; \
    fi
