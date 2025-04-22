FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy server directory 
COPY server ./server/

# Install root dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 5001

# Start the application
CMD ["npm", "start"] 