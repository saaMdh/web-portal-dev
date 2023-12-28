<template>
  <announ-field
    v-if="store"
    :model-value="modelValue"
    filled
    multiple
    solo
    clearable
    flat
    :label="$t(label)"
    :store-id="store.id"
    :queries="queries"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></announ-field>
  <announ-field-queries
    v-else
    :model-value="modelValue"
    :queries="queries"
    multiple
    solo
    filled
    clearable
    flat
    :label="$t('components.fields.linkField.announFieldLabel')"
    @update:modelValue="v => $emit('update:modelValue', v)"
  ></announ-field-queries>
</template>

<script>
import AnnounFieldQueries from "@/components/SiteBuilder/Fields/AnnounFieldQueries.vue";
import AnnounField from "@/components/SiteBuilder/Fields/AnnounField.vue";

import { mapGetters } from "vuex";
import { sync } from "vuex-pathify";

export default {
  components: { AnnounField, AnnounFieldQueries },

  props: {
    modelValue: {
      type: [Object, String, Number, Array],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    landType: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters({ store: "builder/store", queries: "builder/queries" }),
    ...sync({ siteBuild: "builder/siteBuild" }),
    queries() {
      return this.siteBuild.queries;
    }
  }
};
</script>

<style></style>
