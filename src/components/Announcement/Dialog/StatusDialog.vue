<template>
  <v-dialog v-model="active" max-width="500px">
    <v-form @submit.prevent>
      <v-card>
        <v-card-title>
          {{ $t("announcement.alerts.status.title") }}
        </v-card-title>

        <v-card-text>
          {{ $t("announcement.alerts.status.message") }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :aria-label="$t('_.cancel')"
            variant="text"
            color="primary"
            @click="close"
            >{{ $t("_.cancel") }}</v-btn
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
        return this.$store.state.dialog.modelStatus;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelStatus" });
      }
    }
  },

  methods: {
    close() {
      this.active = false;
    }
  }
};
</script>

<style></style>
