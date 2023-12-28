export default {
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV !== "production",

  NODE_ENV: process.env.NODE_ENV,
  VUE_APP_GRAPHQL_HTTP: process.env.VUE_APP_GRAPHQL_HTTP,
  VUE_APP_SOCKET_IO: process.env.VUE_APP_SOCKET_IO,
  VUE_APP_UPLOAD: process.env.VUE_APP_UPLOAD,
  VUE_APP_OUEDKNISS_AUTH: process.env.VUE_APP_OUEDKNISS_AUTH,
  VUE_APP_OUEDKNISS_INTEL: process.env.VUE_APP_OUEDKNISS_INTEL,
  VUE_APP_OUEDKNISS_PANEL: process.env.VUE_APP_OUEDKNISS_PANEL,
  VUE_APP_OUEDKNISS_PORTAL: process.env.VUE_APP_OUEDKNISS_PORTAL,
  VUE_APP_OUEDKNISS_STORE: process.env.VUE_APP_OUEDKNISS_STORE,
  VUE_APP_OUEDKNISS_MARKET: process.env.VUE_APP_OUEDKNISS_MARKET,
  VUE_APP_OUEDKNISS_DJEZZY: process.env.VUE_APP_OUEDKNISS_DJEZZY,
  VUE_APP_RECAPTCHA_KEY: process.env.VUE_APP_RECAPTCHA_KEY,
  VUE_APP_INVISIBLE_RECAPTCHA_KEY: process.env.VUE_APP_INVISIBLE_RECAPTCHA_KEY,
  VUE_APP_DISABLE_MESSENGER: process.env.VUE_APP_DISABLE_MESSENGER,
  VUE_APP_GOOGLE_MAPS_KEY: process.env.VUE_APP_GOOGLE_MAPS_KEY,
  VUE_APP_GOOGLE_ANALYTICS_4_KEY: process.env.VUE_APP_GOOGLE_ANALYTICS_4_KEY,
  VUE_APP_GOOGLE_ANALYTICS_SECRET_CODE:
    process.env.VUE_APP_GOOGLE_ANALYTICS_SECRET_CODE,
  VUE_APP_FIREBASE_CONFIG: process.env.VUE_APP_FIREBASE_CONFIG,
  VUE_APP_STATS_API: process.env.VUE_APP_STATS_API,
  VUE_APP_PIXEL_API: process.env.VUE_APP_PIXEL_API,
  VUE_APP_DISABLE_OKPIXEL: process.env.VUE_APP_DISABLE_OKPIXEL,
  VUE_APP_SHOW_CUSTOM_ADS: process.env.VUE_APP_SHOW_CUSTOM_ADS,
  VUE_APP_OUEDKNISS_CDN: process.env.VUE_APP_OUEDKNISS_CDN,
  VUE_APP_BRANCH_NAME: process.env.VUE_APP_BRANCH_NAME,
  VUE_APP_OKAPTCHA_API: process.env.VUE_APP_OKAPTCHA_API
};