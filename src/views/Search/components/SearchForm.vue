<template>
  <div>
    <vv-form @submit.prevent="makeSearch" @keyup.enter="makeSearch">
      <v-text-field
        ref="field"
        v-model="q"
        class="search-input"
        flat
        :bg-color="$vuetify.theme.current.dark ? '#151515' : '#f5f5f5'"
        variant="solo-filled"
        rounded
        single-line
        density="compact"
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
            rounded
            variant="elevated"
            color="primary"
            @click="makeSearch"
          >
            <v-icon size="x-large"> mdi-magnify </v-icon>
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
    modelValue(v) {
      this.q = (v || "").unslugify();
      this.active = true;
      this.DelayedInput();
    }
  },
  mounted: function () {
    this.$emit("update:modelValue", this.q);
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
