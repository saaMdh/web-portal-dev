<template>
  <alert-menu
    v-if="userAction"
    v-model="active"
    :loading="loading > 0"
    :nb-items="unread"
    :menu-bind="menuBind"
    offset="10"
    location="bottom end"
    transition="slide-y-transition"
  ></alert-menu>
  <v-btn
    v-else
    :aria-label="$t('_.notifications')"
    :loading="
      $store.state.app.pluginsStatus === 'LOADING' ||
      $store.state.app.pluginsStatus === 'INITIAL'
    "
    icon
    :ripple="false"
    @click="fetchComponent()"
  >
    <v-badge v-if="enable" end overlap :model-value="unread > 0">
      <template #badge>{{ unread }}</template>
      <v-icon>mdi-bell</v-icon>
    </v-badge>
  </v-btn>
</template>

<script>
import get from "lodash/get";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    AlertMenu: defineAsyncComponent(() => import("./component/AlertMenu.vue"))
  },
  props: {
    enable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: false,
      userAction: false
    };
  },
  computed: {
    loading() {
      return get(this.$notifications, "state.loading", 0);
    },
    unread() {
      return get(this.$notifications, "state.unread", 0);
    },
    menuBind() {
      if (this.$isMobile) {
        return {
          width: "350",
          maxHeight: "500"
        };
      } else {
        return {
          width: "400",
          maxHeight: "600"
        };
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.userAction = true;
    }, 4000);
  },
  methods: {
    fetchComponent() {
      this.userAction = true;
      setTimeout(() => {
        this.active = true;
      }, 100);
    }
  }
};
</script>

<style></style>
