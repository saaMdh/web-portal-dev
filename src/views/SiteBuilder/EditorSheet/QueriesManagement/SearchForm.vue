<template>
  <div>
    <vv-form @submit="makeSearch" @keyup.enter="makeSearch">
      <v-text-field
        ref="field"
        v-model="q"
        class="search-input"
        variant="solo-filled"
        single-line
        density="comfortable"
        hide-details
        :clearable="!!q"
        clear-icon="mdi-close"
        :placeholder="$t('search.searchIn')"
        @click:clear="clear"
        @keydown="DelayedInput"
        @change="DelayedInput"
      >
        <template #append-inner>
          <v-btn
            size="small"
            :aria-label="$t('_.search')"
            variant="elevated"
            color="primary"
            disabled
          >
            <v-icon> mdi-magnify </v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </vv-form>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: null
    },
    search: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      q: this.modelValue ? this.modelValue.unslugify() : "",
      active: false
    };
  },

  watch: {
    value(v) {
      this.q = (v || "").unslugify();
      this.active = true;
      this.DelayedInput();
    }
  },
  methods: {
    clear() {
      this.q = "";
      this.$emit("update:modelValue", this.q);
    },
    makeSearch() {
      this.active = false;
      this.$refs.field.blur();
      this.$emit("submit");
    },
    input() {
      this.$emit("update:modelValue", this.q);
    },
    DelayedInput() {
      setTimeout(this.input, 50);
    }
  }
};
</script>

<style lang="scss">
.search-icon {
  background: rgb(var(--v-theme-primary)) !important;
  color: white !important;
  border-radius: 50%;
  padding: 4px;
}

.search-input .v-input__slot {
  padding: 0 8px 0 14px !important;
}
.v-locale--is-rtl .search-input .v-input__slot {
  padding: 0 14px 0 8px !important;
}
.search-input .v-input__append-inner {
  margin: 6px 0 !important;
}
</style>
