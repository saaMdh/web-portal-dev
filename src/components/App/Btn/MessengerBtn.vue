<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-btn
        :loading="
          $store.state.app.pluginsStatus === 'LOADING' ||
          $store.state.app.pluginsStatus === 'INITIAL'
        "
        :aria-label="$t('topbar.messenger')"
        v-bind="props"
        :icon="!isPortal || $isDesktop"
        @click.stop="activeDialog"
      >
        <v-badge
          v-if="enable"
          :model-value="$messenger.state.unreadThreads.length > 0"
          :content="
            $messenger.state.unreadThreads.length < 10
              ? $messenger.state.unreadThreads.length
              : '+10'
          "
          end
          overlap
        >
          <v-icon>mdi-message</v-icon>
        </v-badge>
        <span v-if="isPortal && $isMobile">{{ $t("topbar.messenger") }}</span>
      </v-btn>
    </template>
    <span>{{ $t("topbar.messenger") }}</span>
  </v-tooltip>
</template>

<script>
export default {
  inject: ["openMessengerDrawer"],
  props: {
    enable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    activeDialog() {
      this.$messenger.state.active = true;
      this.openMessengerDrawer();
    }
  }
};
</script>

<style></style>
