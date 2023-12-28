<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.share')"
    icon
    elevation="1"
    @click="shareThis"
  >
    <v-icon size="large">mdi-share-variant</v-icon>
    <share-dialog
      v-if="renderChild && announcement"
      ref="shareDialog"
      v-model="shareDialogOpen"
      :announcement="announcement"
    ></share-dialog>
  </v-btn>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    ShareDialog: defineAsyncComponent(() => import("../Dialog/ShareDialog.vue"))
  },

  props: {
    announcement: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      shareDialogOpen: false,
      renderChild: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.renderChild = true;
    }, 4000);
  },

  methods: {
    shareThis() {
      this.renderChild = true;
      if (navigator.share) {
        navigator.share({
          title: this.announcement.title,
          text: this.announcement.description
            ? this.announcement.description
            : "",
          url: location.href
        });
      } else {
        this.shareDialogOpen = true;
      }
    }
  }
};
</script>

<style></style>
