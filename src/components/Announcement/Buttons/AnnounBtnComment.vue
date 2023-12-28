<template>
  <v-btn
    v-bind="$attrs"
    :aria-label="$t('_.message')"
    :size="mini ? 'small' : 'default'"
    variant="text"
    class="text-capitalize"
    @click="check"
  >
    <v-icon :class="mini ? '' : 'me-1'">mdi-comment-outline</v-icon>
    <span v-if="!mini">{{ $t("announcement.comment") }}</span>
  </v-btn>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

const STATUS = ["PUBLISHED", "EDITED"];

export default {
  props: {
    announcement: {
      type: Object,
      required: true
    },
    mini: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { user, scope } = useAuthFrame();

    return {
      user,
      scope
    };
  },

  computed: {
    canDoActions() {
      return STATUS.includes(this.announcement.status);
    }
  },

  methods: {
    check() {
      const vm = this;
      setTimeout(() => {
        if (!vm.user)
          return vm.$store.commit("dialog/openDialog", {
            name: "modelConnexion"
          });
        if (!vm.user.isValidated)
          return vm.$store.commit("dialog/openDialog", {
            name: "modelValidation"
          });
        if (!vm.canDoActions)
          return vm.$store.commit("dialog/openDialog", {
            name: "modelStatus"
          });
        vm.$store.commit("app/setAnnouncement", vm.announcement);
        vm.$store.commit("dialog/openDialog", {
          name: "modelComment"
        });
      }, 200);
    }
  }
};
</script>

<style></style>
