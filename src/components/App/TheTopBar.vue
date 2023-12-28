<template>
  <v-app-bar
    class="o-app-bar"
    height="56"
    scroll-threshold="60"
    scroll-behavior="hide"
    :style="{ direction: $vuetify.locale.rtl ? 'rtl' : 'ltr' }"
  >
    <v-container class="d-flex align-center py-0 pe-1">
      <template v-if="$isMobile & ($route.name != 'home')">
        <announ-btn-back density="compact" class="me-2"></announ-btn-back>
      </template>
      <nav-btn v-if="$isDesktop"></nav-btn>
      <router-link
        :alt="$t('topbar.home')"
        :to="{ name: 'home' }"
        class="d-block"
        @click="goToTop"
      >
        <template v-if="$isMobile">
          <img
            class="d-block"
            style="height: 31px; display: block"
            :alt="$t('meta.title')"
            :src="require('@/assets/logo-mobile-ps.svg')"
          />
        </template>
        <template v-else>
          <img
            v-if="$vuetify.locale.rtl"
            style="height: 31px; display: block"
            class="d-block"
            :alt="$t('meta.title')"
            :src="
              $vuetify.theme.current.dark
                ? require('@/assets/logo-light-h-w-ar-ps.svg')
                : require('@/assets/logo-h-w-ar-ps.svg')
            "
          />
          <img
            v-else
            style="height: 31px; display: block"
            :alt="$t('meta.title')"
            :src="
              $vuetify.theme.current.dark
                ? require('@/assets/logo-light-h-w-ps.svg')
                : require('@/assets/logo-h-w-ps.svg')
            "
          />
        </template>
      </router-link>
      <branch-name class="ms-2" />
      <template v-if="$isDesktop">
        <v-spacer></v-spacer>
        <the-top-bar-search></the-top-bar-search>
        <v-spacer></v-spacer>
      </template>
      <v-spacer v-else></v-spacer>
      <div class="d-flex justify-end">
        <!-- Alerts -->
        <alert-btn
          v-if="user"
          :enable="$store.state.app.pluginsStatus === 'CONNECTED'"
        ></alert-btn>
        <!-- Cart -->
        <cart-btn :user="user" :cart-offline="cart"></cart-btn>
        <div v-if="$isDesktop">
          <!-- bookmark -->
          <bookmark-btn v-if="user"></bookmark-btn>
          <!-- Account -->

          <messenger-btn
            v-if="showMessenger"
            :enable="$store.state.app.pluginsStatus === 'CONNECTED'"
          ></messenger-btn>
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-btn
                :aria-label="$t('topbar.publish')"
                v-bind="props"
                icon
                @click.stop="publish"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </template>

            <span>{{ $t("topbar.publish") }}</span>
          </v-tooltip>
        </div>
        <account-btn
          v-model="scope"
          :user="user"
          :cart="cart"
          :list="list"
        ></account-btn>
        <nav-btn v-if="$isMobile"></nav-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import TheTopBarSearch from "@/components/App/TheTopBar/TheTopBarSearch.vue";

import CartBtn from "@/components/App/Btn/CartBtn.vue";
import NavBtn from "@/components/App/Btn/NavBtn.vue";
import MessengerBtn from "@/components/App/Btn/MessengerBtn.vue";
import BookmarkBtn from "@/components/App/Btn/BookmarkBtn.vue";
import AlertBtn from "@/components/App/Btn/AlertBtn.vue";
import BranchName from "@/components/BranchName.vue";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import env from "@/utils/env.js";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    BranchName,
    TheTopBarSearch,
    CartBtn,
    NavBtn,
    MessengerBtn,
    BookmarkBtn,
    AlertBtn,
    AccountBtn: defineAsyncComponent(() =>
      import("@/components/App/Btn/AccountBtn.vue")
    ),
    AnnounBtnBack: defineAsyncComponent(() =>
      import("@/components/App/Btn/AnnounBtnBack.vue")
    )
  },
  setup() {
    const { user, scopeList, cart, scope } = useAuthFrame();
    return {
      user,
      list: scopeList,
      cart,
      scope
    };
  },
  computed: {
    showMessenger() {
      return (
        this.user &&
        !this.user.isAnonymous &&
        !parseInt(env.VUE_APP_DISABLE_MESSENGER)
      );
    }
  },
  methods: {
    publish() {
      return this.$router.push({ name: "publish" });
    },
    goToTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss">
.o-app-bar {
  z-index: 100 !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 5px !important;
}
</style>
