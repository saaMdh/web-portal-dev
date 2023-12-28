import env from "@/utils/env";
import { createHead } from "@unhead/vue";
import ScrollOffset from "./ScrollOffset";

import StatsPlugin from "@ouedkniss/web-ui-plugin/src/plugins/stats-plugin";
import {
  getTrackingHeaders,
  initTrackingHeaders
} from "@ouedkniss/web-ui-plugin/src/utils/Tracking";
import {
  getVersioningHeaders,
  initVersioningHeaders
} from "@ouedkniss/web-ui-plugin/src/utils/Versioning";

import OkImg from "@ouedkniss/web-ui-plugin/src/components/Img/OkImg";
import AnnounImg from "@ouedkniss/web-ui-plugin/src/components/Img/AnnounImg";
import CategoryImg from "@ouedkniss/web-ui-plugin/src/components/Img/CategoryImg";
import StoreImg from "@ouedkniss/web-ui-plugin/src/components/Img/StoreImg";
import UserAvatar from "@ouedkniss/web-ui-plugin/src/components/Img/UserAvatar";
import DataPlaceholder from "@/components/Content/DataPlaceholder.vue";

import { VueRecaptchaPlugin } from "vue-recaptcha";

import CartPlugin from "@ouedkniss/web-cart-plugin/src/install";
import NotificationPlugin from "@ouedkniss/web-notification-plugin/src/install";
import MessengerPlugin from "@ouedkniss/web-messenger-plugin/src/install";

export function LoadPluginComponent(app) {
  app.component("OkImg", OkImg);
  app.component("StoreImg", StoreImg);
  app.component("AnnounImg", AnnounImg);
  app.component("UserAvatar", UserAvatar);
  app.component("CategoryImg", CategoryImg);
  app.component("DataPlaceholder", DataPlaceholder);
}

export function LoadPlugin({ app, apollo, router, i18n }) {
  router;
  initTrackingHeaders();
  initVersioningHeaders();

  const head = createHead();
  app.use(head);

  app.use(ScrollOffset);

  app.use(VueRecaptchaPlugin, {
    v2SiteKey: env.VUE_APP_RECAPTCHA_KEY
  });
  
  app.use(CartPlugin, {
    apollo,
    i18n
  });

  app.use(MessengerPlugin, {
    apollo,
    i18n
  });
  app.use(NotificationPlugin, {
    apollo,
    i18n
  });

  app.use(StatsPlugin, {
    headers: {
      ...getTrackingHeaders(),
      ...getVersioningHeaders()
    }
  });
}
