## Build image
FROM node:lts-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY ./ .
ENV SNOWPACK_PUBLIC_API_URL='/api'
RUN npm run build

## Final image
FROM nginx:stable-alpine

# set timezone to GMT time zone
# replace shell with bash
# install base dependencies
ENV TZ=GMT
RUN echo $TZ > /etc/timezone \
  && echo $TZ > /etc/localtime \
  && apk update \
  && apk upgrade

## Custom NGINX settings
COPY --chown=nginx:nginx --from=build /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

## Application folder
WORKDIR /usr/share/nginx/html

COPY --chown=nginx:nginx --from=build /app/build .

#COPY --chown=nginx:nginx --from=build /app/build /usr/share/nginx/html
## COPY --from=build /app/confd /usr/local/bin/confd

#COPY --chown=nginx:nginx /nginx/default.conf /etc/nginx/conf.d/default.conf
## COPY --chown=nginx:nginx docker/bin/boot.sh /docker-entrypoint.d/boot.sh

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
