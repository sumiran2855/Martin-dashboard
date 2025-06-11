# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

RUN apk add --no-cache curl

# Copy environment variables
# COPY .env.local .env.local

# Ensure environment variables are available during build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Expose the Next.js default port
EXPOSE 3001

# Start Next.js in production mode
CMD ["npm", "run", "dev"]
