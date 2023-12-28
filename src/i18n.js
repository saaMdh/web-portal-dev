import { createI18n } from "vue-i18n";

import env from "@/utils/env.js";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import * as uiLocales from "@ouedkniss/web-ui-plugin/src/locales";
import * as cartLocales from "@ouedkniss/web-cart-plugin/src/locales";
import * as notificationLocales from "@ouedkniss/web-notification-plugin/src/locales";
import * as messengerLocales from "@ouedkniss/web-messenger-plugin/src/locales";
import merge from "lodash/merge";

export async function setupI18n() {
  const { locale } = useAuthFrame();
  const _locale = locale.value || "fr";
  const options = {
    legacy: false,
    locale: env.VUE_APP_I18N_LOCALE || _locale,
    fallbackLocale: env.VUE_APP_I18N_FALLBACK_LOCALE || _locale,
    messages: {}
  };
  const message = await loadLocaleMessages(_locale);
  options.messages[_locale] = message.default;

  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  mergeLocalePlugins(i18n);
  return i18n;
}

async function loadLocaleMessages(locale) {
  return await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.js`
  );
}

function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  document.querySelector("html").setAttribute("lang", locale);
}

function mergeLocalePlugins(i18n) {
  const { fr, ar, en } = merge(
    uiLocales,
    cartLocales,
    notificationLocales,
    messengerLocales
  );
  i18n.global.mergeLocaleMessage("fr", fr);
  i18n.global.mergeLocaleMessage("ar", ar);
  i18n.global.mergeLocaleMessage("en", en);
}
