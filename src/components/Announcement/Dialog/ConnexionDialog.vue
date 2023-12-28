<template>
  <v-dialog v-model="active" max-width="500px">
    <v-form @submit.prevent="continueLogin">
      <v-card>
        <v-card-title>
          {{ $t("announcement.alerts.login.title") }}
        </v-card-title>

        <v-card-text>
          {{ $t("announcement.alerts.login.message") }}
        </v-card-text>

        <v-card-actions>
          <v-btn :aria-label="$t('_.cancel')" variant="text" @click="close">{{
            $t("_.cancel")
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :aria-label="$t('announcement.alerts.login.continue')"
            type="submit"
            variant="text"
            color="primary"
            >{{ $t("announcement.alerts.login.continue") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.dialog.modelConnexion;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelConnexion" });
      }
    }
  },
  methods: {
    continueLogin() {
      this.close();
      this.$router.push({
        name: "login"
      });
    },
    close() {
      this.active = false;
    }
  }
};
</script>

<style></style>
