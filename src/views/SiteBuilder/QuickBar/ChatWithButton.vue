<template>
  <div v-if="!DISABLE_MESSENGER">
    <v-btn
      :aria-label="$t('_.chat')"
      variant="tonal"
      size="small"
      class="px-2"
      :loading="$store.state.app.pluginsStatus === 'LOADING'"
      @click="chatWithStore"
    >
      <v-icon size="small" start>mdi-message</v-icon>
      {{ $t("_.chat") }}
    </v-btn>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapGetters } from "vuex";
import env from "@/utils/env.js";

export default {
  inject: ["showAuthRequired"],

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  data() {
    return {
      DISABLE_MESSENGER: parseInt(env.VUE_APP_DISABLE_MESSENGER)
    };
  },
  computed: {
    ...mapGetters({ store: "builder/store" })
  },
  methods: {
    chatWithStore() {
      if (!this.user) {
        return this.$store.commit("dialog/openDialog", {
          name: "modelConnexion"
        });
      } else {
        this.$messenger.chatWith({ type: "STORE", id: this.store.id });
      }
    }
  }
};
</script>

<style></style>
