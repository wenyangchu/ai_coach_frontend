FROM node:22

# Optional: manually install dev tools
RUN apt-get update && apt-get install -y git curl sudo
