<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="dateFormated"
    prepend-inner-icon="mdi-calendar"
    readonly
    :disabled="disabled"
    @click="openDialog"
  />

  <v-dialog v-model="dialog" max-width="360" content-class="ma-0 w-100">
    <v-date-picker
      :title="
        multiple ? $t('travel.dates.selectMultiple') : $t('travel.dates.select')
      "
      show-adjacent-months
      hide-header="true"
      :allowed-dates="allowedDates"
      :multiple="multiple"
      :model-value="modelValue"
      @update:modelValue="change"
      @click:cancel="dialog = false"
    >
    </v-date-picker>
  </v-dialog>
</template>

<script>
import { VDatePicker } from "vuetify/labs/VDatePicker";
import { format, addHours } from "date-fns";
import fr from "date-fns/locale/fr";
import ar from "date-fns/locale/ar-DZ";
import en from "date-fns/locale/en-US";

export default {
  components: {
    VDatePicker
  },
  props: {
    allowedDates: {
      type: Function
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      dialog: false,
      date: null
    };
  },

  computed: {
    dateFormated() {
      return format(this.date, "yyyy-MM-dd", { locale: this.getLocale() });
    }
  },

  watch: {
    modelValue: {
      handler: "parse",
      immediate: true
    }
  },

  methods: {
    parse(value) {
      this.date = value;
    },
    change(stringDate) {
      this.date = addHours(new Date(stringDate), 5);
      this.$emit("update:modelValue", this.date);
      this.dialog = false;
    },
    openDialog() {
      if (!this.disabled) this.dialog = true;
    },
    getLocale() {
      if (this.$vuetify.locale.current == "fr") return fr;
      if (this.$vuetify.locale.current == "ar") return ar;
      if (this.$vuetify.locale.current == "en") return en;
      return fr;
    }
  }
};
</script>

<style></style>
