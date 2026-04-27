FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y --fix-missing --no-install-recommends \
  chromium \
  chromium-driver \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libgtk-3-0 \
  libx11-xcb1 \
  libxxf86vm1 \
  libxxf86dga1 \
  fonts-liberation \
  xdg-utils \
  wget \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3001

CMD ["npm", "run", "start:api"]