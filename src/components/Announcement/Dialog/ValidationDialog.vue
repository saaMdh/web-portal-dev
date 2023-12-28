<template>
  <v-dialog v-model="active" max-width="500px">
    <v-form @submit.prevent="continueLogin">
      <v-card>
        <v-card-title>
          {{ $t("announcement.alerts.validation.title") }}
        </v-card-title>

        <v-card-text>
          {{ $t("announcement.alerts.validation.message.0") }}
        </v-card-text>
        <v-card-text>
          {{ $t("announcement.alerts.validation.message.1") }}
        </v-card-text>

        <v-card-actions>
          <v-btn :aria-label="$t('_.cancel')" variant="text" @click="close">{{
            $t("_.cancel")
          }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :aria-label="$t('announcement.alerts.validation.validate')"
            variant="text"
            color="primary"
            @click="validate"
            >{{ $t("announcement.alerts.validation.validate") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <phones-manager-dialog v-model="manager"></phones-manager-dialog>
  </v-dialog>
</template>

<script>
export default {
  components: {
    PhonesManagerDialog: () => ({
      loader: () => import(
        "@ouedkniss/web-ui-plugin/src/components/Dialog/PhonesManagerDialog.vue"
      ),
      // loading: LoadingComponent,
      // error: ErrorComponent,
      timeout: 4000
    })
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      manager: false
    };
  },
  computed: {
    active: {
      get() {
        return this.$store.state.dialog.modelValidation;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelValidation" });
      }
    }
  },
  methods: {
    close() {
      this.active = false;
    },

    validate() {
      this.manager = !this.manager;
    }
  }
};
</script>

<style></style>
