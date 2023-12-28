# Building stage
FROM registry.ouedkniss.com/node:16-alpine as build-stage

ARG VUE_APP_GRAPHQL_HTTP
ARG VUE_APP_SOCKET_IO
ARG VUE_APP_UPLOAD
ARG VUE_APP_OUEDKNISS_AUTH
ARG VUE_APP_OUEDKNISS_PANEL
ARG VUE_APP_OUEDKNISS_PORTAL
ARG VUE_APP_OUEDKNISS_STORE
ARG VUE_APP_OUEDKNISS_MARKET
ARG VUE_APP_OUEDKNISS_DJEZZY
ARG VUE_APP_OUEDKNISS_INTEL
ARG VUE_APP_RECAPTCHA_KEY
ARG VUE_APP_INVISIBLE_RECAPTCHA_KEY
ARG VUE_APP_DISABLE_MESSENGER
ARG VUE_APP_DISABLE_OKPIXEL
ARG VUE_APP_SHOW_CUSTOM_ADS
ARG VUE_APP_GOOGLE_ANALYTICS_4_KEY
ARG VUE_APP_GOOGLE_ANALYTICS_SECRET_CODE
ARG VUE_APP_FIREBASE_CONFIG
ARG VUE_APP_STATS_API
ARG VUE_APP_PIXEL_API
ARG VUE_APP_OUEDKNISS_CDN
ARG VUE_APP_OKAPTCHA_API
ARG VUE_APP_GOOGLE_MAPS_KEY
ARG VUE_APP_I18N_LOCALE=fr
ARG VUE_APP_I18N_FALLBACK_LOCALE=fr
ARG VUE_APP_BRANCH_NAME
ARG NODE_ENV=development

WORKDIR /app

COPY . .

RUN ([ ! -d node_modules ]  && yarn install --frozen-lockfile --no-progress --production=false) || echo "skip install modules"

RUN echo -e "NODE_ENV=${NODE_ENV} \n \
    VUE_APP_BRANCH_NAME=${VUE_APP_BRANCH_NAME}\n \
    VUE_APP_GRAPHQL_HTTP=${VUE_APP_GRAPHQL_HTTP}\n \
    VUE_APP_SOCKET_IO=${VUE_APP_SOCKET_IO}\n \
    VUE_APP_UPLOAD=${VUE_APP_UPLOAD}\n \
    VUE_APP_OUEDKNISS_AUTH=${VUE_APP_OUEDKNISS_AUTH}\n \
    VUE_APP_OUEDKNISS_PANEL=${VUE_APP_OUEDKNISS_PANEL}\n \
    VUE_APP_OUEDKNISS_PORTAL=${VUE_APP_OUEDKNISS_PORTAL}\n \
    VUE_APP_OUEDKNISS_STORE=${VUE_APP_OUEDKNISS_STORE}\n \
    VUE_APP_OUEDKNISS_MARKET=${VUE_APP_OUEDKNISS_MARKET}\n \
    VUE_APP_OUEDKNISS_DJEZZY=${VUE_APP_OUEDKNISS_DJEZZY}\n \
    VUE_APP_OUEDKNISS_INTEL=${VUE_APP_OUEDKNISS_INTEL}\n \
    VUE_APP_RECAPTCHA_KEY=${VUE_APP_RECAPTCHA_KEY}\n \
    VUE_APP_DISABLE_MESSENGER=${VUE_APP_DISABLE_MESSENGER}\n \
    VUE_APP_DISABLE_OKPIXEL=${VUE_APP_DISABLE_OKPIXEL}\n \
    VUE_APP_SHOW_CUSTOM_ADS=${VUE_APP_SHOW_CUSTOM_ADS}\n \
    VUE_APP_INVISIBLE_RECAPTCHA_KEY=${VUE_APP_INVISIBLE_RECAPTCHA_KEY}\n \
    VUE_APP_STATS_API=${VUE_APP_STATS_API}\n \
    VUE_APP_PIXEL_API=${VUE_APP_PIXEL_API}\n \
    VUE_APP_GOOGLE_MAPS_KEY=${VUE_APP_GOOGLE_MAPS_KEY}\n \
    VUE_APP_GOOGLE_ANALYTICS_4_KEY=${VUE_APP_GOOGLE_ANALYTICS_4_KEY}\n \
    VUE_APP_GOOGLE_ANALYTICS_SECRET_CODE=${VUE_APP_GOOGLE_ANALYTICS_SECRET_CODE}\n \
    VUE_APP_FIREBASE_CONFIG=${VUE_APP_FIREBASE_CONFIG}\n \
    VUE_APP_OUEDKNISS_CDN=${VUE_APP_OUEDKNISS_CDN}\n \
    VUE_APP_OKAPTCHA_API=${VUE_APP_OKAPTCHA_API}\n \
    VUE_APP_I18N_LOCALE=${VUE_APP_I18N_LOCALE}\n \
    VUE_APP_I18N_FALLBACK_LOCALE=${VUE_APP_I18N_FALLBACK_LOCALE}" > .env && cat .env && ./node_modules/.bin/gulp build #skipsnapshot

# Post-build stage

FROM registry.ouedkniss.com/nginx:stable-alpine as post-build-stage

COPY --from=build-stage /app/dist/modern /usr/share/nginx/html/modern
COPY --from=build-stage /app/dist/legacy /usr/share/nginx/html/legacy

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
