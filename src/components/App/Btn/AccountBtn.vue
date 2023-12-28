<template>
  <v-menu
    v-if="user"
    v-bind="menuBind"
    offset="10"
    location="bottom end"
    transition="slide-y-transition"
  >
    <template #activator="{ props }">
      <v-btn
        :aria-label="$t('topbar.account.my.1')"
        v-bind="props"
        icon
        class="o-scope-btn"
      >
        <user-avatar
          v-if="['User', 'DeliveryProvider', 'Admin'].includes(scope.type)"
          :size="30"
          v-bind="props"
          link
          :user="user"
        />
        <v-avatar v-else :size="28" :image="scope.avatarUrl"> </v-avatar>
      </v-btn>
    </template>

    <v-list class="pa-0">
      <v-list-item @click="GoToAdmin()">
        <template #prepend>
          <v-icon> mdi-desktop-mac-dashboard </v-icon>
        </template>
        <v-list-item-title>
          {{ $t("topbar.account.my.0") }}
        </v-list-item-title>
      </v-list-item>

      <template v-if="!user.isAnonymous">
        <v-divider></v-divider>
        <v-list-subheader> {{ $t("topbar.account.my.1") }}</v-list-subheader>

        <v-list-item
          v-for="item in list"
          :key="item.index"
          :value="item.name"
          :class="
            list.length > 1 && scope.name == item.name
              ? 'scope-item-active'
              : ''
          "
          @click="selectScope(item)"
        >
          <template #prepend>
            <user-avatar
              v-if="['User', 'DeliveryProvider', 'Admin'].includes(item.type)"
              :user="item.entity"
              :size="32"
            ></user-avatar>
            <v-avatar v-else :size="28" :image="item.avatarUrl"></v-avatar>
          </template>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("topbar.account." + item.type) }}
          </v-list-item-subtitle>
          <template #append>
            <v-icon v-if="scope.name == item.name">mdi-check</v-icon>
          </template>
        </v-list-item>

        <template v-if="list.length == 1 && !user.isAnonymous">
          <v-list-item :to="{ name: 'purchase_store' }">
            <template #prepend>
              <v-icon> mdi-store </v-icon>
            </template>
            <v-list-item-title>{{ $t("topbar.pro") }}</v-list-item-title>
          </v-list-item></template
        >
        <v-divider></v-divider>
      </template>
      <v-list-item :to="{ name: 'logout' }">
        <template #prepend>
          <v-icon> mdi-logout </v-icon>
        </template>
        <v-list-item-title>{{ $t("topbar.logout") }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn
    v-else
    :aria-label="$t('topbar.account.login')"
    icon
    :to="{ name: 'login' }"
  >
    <v-icon>mdi-account</v-icon>
  </v-btn>
</template>

<script>
import env from "@/utils/env.js";

export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    cart: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      panel: env.VUE_APP_OUEDKNISS_PANEL,
      model: null
    };
  },
  computed: {
    anounymousAvatar() {
      return require("@/assets/anonymous.svg");
    },
    menuBind() {
      if (this.$isMobile) {
        return {
          width: "300",
          maxHeight: "500"
        };
      } else {
        return {
          width: "300",
          maxHeight: "600"
        };
      }
    },
    scope: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      }
    }
  },
  watch: {
    scope: {
      handler() {
        this.model = this.scope && this.scope.name;
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    selectScope(scope) {
      this.scope = scope;
      this.$store.commit("session/setScope", scope);
    },
    GoToAdmin() {
      this.$router.push({ name: "panel" });
    }
  }
};
</script>

<style lang="scss" scoped>
.scope-item-active {
  background-color: rgba(233, 87, 3, 0.05) !important;
  border: none !important;
}
</style>
