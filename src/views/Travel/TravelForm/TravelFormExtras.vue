<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-checkbox-multiple-marked-outline" color="purple">
      {{ $t("travel.extras.title") }}
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <v-textarea
          v-model="form.moreInformations"
          variant="outlined"
          rows="3"
          :label="$t('travel.extras.form.moreInformations')"
        ></v-textarea>
      </v-card-text>
    </vv-form>
  </v-card>
</template>

<script>
import TravelTitle from "./TravelFormTitle.vue";

const formDefault = {
  moreInformations: ""
};

export default {
  components: { TravelTitle },
  emits: ["submit"],

  data() {
    return {
      form: { ...formDefault }
    };
  },

  methods: {
    async validate() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return isValid;
      this.$emit("submit", this.form);
      return true;
    },
    reset() {
      this.form = { ...formDefault };
      this.$emit("submit", this.form);
    }
  }
};
</script>

<style></style>
