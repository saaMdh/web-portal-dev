<template>
  <v-btn
    v-if="!userAction"
    :aria-label="$t('_.cart')"
    icon
    :ripple="false"
    @click="fetchComponent()"
  >
    <v-badge end overlap :model-value="nbItems > 0">
      <template #badge>{{ nbItems }}</template>
      <v-icon>mdi-cart</v-icon>
    </v-badge>
  </v-btn>
  <cart-menu
    v-else
    v-model="active"
    :nb-items="nbItems"
    :menu-bind="menuBind"
  ></cart-menu>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    CartMenu: defineAsyncComponent(() => import("./component/CartMenu.vue"))
  },
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    cartOffline: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      active: false,
      loading: false,
      userAction: false
    };
  },
  computed: {
    nbItems() {
      return this.$store.state.app.pluginsStatus !== "CONNECTED" || !this.user
        ? this.cartOffline.length
        : this.$cart.state.cart.items.length;
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
