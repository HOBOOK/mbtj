FROM node:20

# --- Global Configuration ---
ENV NODE_ENV=production
WORKDIR /app

# --- Copy Backend ---
COPY service ./service
RUN cd service && npm install

# --- Copy Frontend ---
COPY ui ./ui
RUN cd ui && npm install && npm run build

# --- Set Working Dir for Run ---
WORKDIR /app/service
EXPOSE 3000
CMD ["node", "index.js"]
