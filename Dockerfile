FROM node:20-alpine
WORKDIR /app

# Install system dependencies first
RUN apk add --no-cache git python3 make g++

# Clean any existing yarn installation then install fresh
RUN rm -f /usr/local/bin/yarn && \
    npm install -g yarn --force

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install project dependencies
RUN yarn

# Copy application code
COPY . .

EXPOSE 3019
CMD ["yarn", "dev"]