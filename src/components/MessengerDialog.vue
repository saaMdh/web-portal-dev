<template>
  <v-navigation-drawer
    v-model="$messenger.state.active"
    :location="$vuetify.locale.rtl ? 'start' : 'end'"
    :width="$isDesktop ? 350 : '100%'"
    style="position: fixed;"
  >
    <messenger-popup></messenger-popup>
  </v-navigation-drawer>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    MessengerPopup: defineAsyncComponent({
      delay: 1000,
      loader: () =>
        import(
          "@ouedkniss/web-messenger-plugin/src/components/MessengerWidget.vue"
        )
    })
  }
};
</script>
