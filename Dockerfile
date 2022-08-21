FROM node:alpine
WORKDIR /app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

COPY ./ ./
RUN pip install -r requirements.txt
RUN cd arch-utils && npm install && npm run build
RUN cd arch-utils-backend && npm install
WORKDIR /app/arch-utils-backend
CMD ["npm", "run", "start"]
