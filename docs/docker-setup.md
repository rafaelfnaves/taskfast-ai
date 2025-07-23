# Docker Setup Example

## docker-compose.yml
```
services:
  taskflow:
    build: .
    ports:
    - "3000:3000"
    environment:
    - DATABASE_URL=file:./dev.db
    - OPENAI_API_KEY=${OPENAI_API_KEY}
volumes:
  - ./data:/app/data
```

## Dockerfile
```
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
