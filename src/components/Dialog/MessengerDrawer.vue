<template>
  <ok-drawer
    v-model="$messenger.state.active"
    location="end"
    :width="width"
    touchless
    block-page-scroll
  >
    <messenger-popup></messenger-popup>
  </ok-drawer>
</template>

<script>
import { defineAsyncComponent } from "vue";
import okDrawer from "@/components/uiKit/drawer";

export default {
  components: {
    okDrawer,
    MessengerPopup: defineAsyncComponent({
      delay: 1000,
      loader: () =>
        import(
          "@ouedkniss/web-messenger-plugin/src/components/MessengerWidget.vue"
        )
    })
  },

  computed: {
    width() {
      return this.$isDesktop ||
        (this.$store.state.builder && this.$store.state.builder.editor.enable)
        ? "350px"
        : "100%";
    }
  }
};
</script>
