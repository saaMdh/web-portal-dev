import { isExternalDomain } from "@/utils/location";
const { connectionDomain } = require("@/utils/site-build");
if (isExternalDomain()) connectionDomain();
import { mutate } from "./utils/String";
mutate();

import { createApp } from "vue";

import App from "./App.vue";

import { setupI18n } from "./i18n";
import { _router } from "./router";
import createApolloProvider from "./apollo";
import { _createStore } from "./store";
import vuetify from "./plugins/vuetify";

import { registerMixin } from "./mixins";
import { LoadVeeComponent } from "./plugins/VeeValidate";
import { LoadPluginComponent, LoadPlugin } from "./plugins";
import LoadComponent from "./components";

async function main() {
  const app = createApp(App);
  const apolloProvider = createApolloProvider();
  const store = _createStore(apolloProvider.defaultClient);
  const router = _router({ store, apollo: apolloProvider.defaultClient });
  const i18n = await setupI18n();

  app.config.globalProperties.$apollo = apolloProvider.defaultClient;
  app.config.globalProperties.$vuetify = vuetify;
  app.config.globalProperties.$vuetify.goTo = () => {};
  app.config.globalProperties.$i18n = i18n;
  //app.config.performance = true;
  registerMixin(app);
  LoadPlugin({ app, apollo: apolloProvider.defaultClient, router, i18n });

  LoadVeeComponent(app);

  LoadComponent(app);
  LoadPluginComponent(app);
  app.use(apolloProvider);
  app.use(i18n);
  app.use(store);
  app.use(router);
  app.use(vuetify);

  app.mount("#app");
}

main();
