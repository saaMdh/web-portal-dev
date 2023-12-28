<template>
  <v-card elevation="1" variant="elevated" rounded="lg">
    <travel-title icon="mdi-phone" color="red">
      {{ $t("travel.additionalInfos") }}
    </travel-title>

    <vv-form ref="form">
      <v-card-text>
        <vv-field
          v-slot="{ field, errors }"
          v-model="form.phone"
          name="phone"
          rules="phone"
        >
          <v-text-field
            v-bind="field"
            :model-value="form.phone"
            variant="outlined"
            :error-messages="errors"
            :label="$t('contact.form.phone')"
            hide-details="auto"
          ></v-text-field>
        </vv-field>

        <vv-field
          v-slot="{ field, errors }"
          v-model="form.email"
          name="email"
          rules="email"
        >
          <v-text-field
            v-bind="field"
            :model-value="form.email"
            variant="outlined"
            class="mt-4"
            :error-messages="errors"
            :label="$t('contact.form.email')"
          ></v-text-field>
        </vv-field>
      </v-card-text>
    </vv-form>
  </v-card>
</template>

<script>
import TravelTitle from "./TravelFormTitle.vue";

const formDefault = {
  email: "",
  phone: ""
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
