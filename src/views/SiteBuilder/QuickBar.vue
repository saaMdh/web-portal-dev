<template>
  <v-app-bar
    class="s-toolbar"
    flat
    :theme="$vuetify.theme.current.dark ? 'dark' : 'light'"
    scroll-behavior="hide"
    :scroll-threshold="56"
    height="56"
  >
    <div class="d-flex align-center">
      <v-btn v-if="showPrevBtn" icon size="24" @click="goBack">
        <v-icon size="24">
          {{ $vuetify.locale.rtl ? "mdi-chevron-right" : "mdi-chevron-left" }}
        </v-icon>
      </v-btn>
      <v-btn
        v-if="isExternalDomain()"
        size="small"
        variant="text"
        class="pa-1"
        :href="portal"
      >
        {{ $t("quickbar.ouedkniss.0") }}<b>{{ $t("quickbar.ouedkniss.1") }}</b>
      </v-btn>
      <v-btn
        v-else
        size="small"
        variant="text"
        class="pa-1"
        @click="returnPortal()"
      >
        {{ $t("quickbar.ouedkniss.0") }}<b>{{ $t("quickbar.ouedkniss.1") }}</b>
      </v-btn>
      <branch-name />
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex justify-end align-center">
      <lang-btn></lang-btn>
      <template v-if="user">
        <messenger-btn
          v-if="showMessenger"
          :enable="$store.state.app.pluginsStatus === 'CONNECTED'"
        ></messenger-btn>
        <alert-btn
          v-if="user"
          :enable="$store.state.app.pluginsStatus === 'CONNECTED'"
        ></alert-btn>
      </template>
      <cart-btn :user="user" :cart-offline="cart"></cart-btn>
      <template v-if="user">
        <account-btn
          v-model="scope"
          :user="user"
          :cart="cart"
          :list="list"
        ></account-btn>
      </template>
      <template v-else>
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-btn
              icon
              :to="{ name: isExternalDomain() ? 'login-external' : 'login' }"
              v-bind="props"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          {{ $t("quickbar.login") }}
        </v-tooltip>
      </template>
    </div>
  </v-app-bar>
</template>

<script>
import AccountBtn from "@/components/App/Btn/AccountBtn.vue";
import MessengerBtn from "@/components/App/Btn/MessengerBtn.vue";
import CartBtn from "@/components/App/Btn/CartBtn.vue";
import AlertBtn from "@/components/App/Btn/AlertBtn.vue";
import LangBtn from "@/components/SiteBuilder/Btn/LangBtn.vue";
import BranchName from "@/components/BranchName.vue";

import { isExternalDomain } from "@/utils/location";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapGetters } from "vuex";
import env from "@/utils/env.js";

export default {
  components: {
    BranchName,
    LangBtn,
    AccountBtn,
    AlertBtn,
    CartBtn,
    MessengerBtn
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

  data() {
    return {
      portal: env.VUE_APP_OUEDKNISS_PORTAL,
      DISABLE_MESSENGER: parseInt(env.VUE_APP_DISABLE_MESSENGER),
      firstHistoryState: null,
      showPrevBtn: false
    };
  },
  computed: {
    ...mapGetters({
      currentPage: "builder/currentPage",
      homePage: "builder/homePage"
    }),
    showMessenger() {
      return (
        this.user &&
        !this.user.isAnonymous &&
        !parseInt(env.VUE_APP_DISABLE_MESSENGER)
      );
    }
  },
  watch: {
    $route() {
      if (
        !isExternalDomain() &&
        window.history.state.key == this.firstHistoryState.key
      ) {
        if (this.$store.state.builder.referrer) {
          this.showPrevBtn = true;
        } else {
          this.showPrevBtn = false;
        }
      } else if (this.$route.meta.pageIndex) {
        this.showPrevBtn = true;
      }
    }
  },
  mounted() {
    this.firstHistoryState = window.history.state;
  },
  methods: {
    isExternalDomain,
    returnPortal() {
      if (this.$store.state.builder.referrer) {
        this.$router.push(this.$store.state.builder.referrer);
      } else this.$router.push({ name: "home" });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive";
.s-toolbar {
  z-index: 100 !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 5px !important;
  .v-toolbar__content,
  .v-toolbar__extension {
    padding: 0 8px !important;
    max-width: 1200px;
    margin: 0 auto;
  }
}

.o-app-bar-mob {
  &.v-theme--light {
    background-color: white !important;
  }

  .v-toolbar__content,
  .v-toolbar__extension {
    margin: auto;

    @media (min-width: 1366px) {
      max-width: 1300px;
    }
  }

  &__logo {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 10px;
    width: 200px;
    margin-left: -(250px / 2);

    svg {
      width: 100%;
    }

    path {
      fill: rgb(var(--v-theme-primary));
    }
  }
}
</style>
