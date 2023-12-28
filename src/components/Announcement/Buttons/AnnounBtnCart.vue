<template>
  <v-btn
    :size="mini ? 'small' : 'default'"
    variant="text"
    v-bind="$attrs"
    class="text-capitalize"
    @click="openCartDialog()"
  >
    <v-icon class="me-1" size="20">mdi-plus</v-icon>
    {{ $t("announcement.cart") }}
  </v-btn>
</template>

<script>
export default {
  props: {
    announcement: {
      type: Object,
      required: false
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openCartDialog() {
      this.$store.commit("app/setAnnouncement", this.announcement);
      return this.$store.commit("dialog/openDialog", {
        name: "modelCart"
      });
    }
  }
};
</script>

<style></style>
