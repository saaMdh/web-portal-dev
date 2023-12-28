<template>
  <v-select
    :item-title="item => item.name[locale]"
    :items="queries"
    :model-value="modelValue"
    return-object
    clearable
    :multiple="multiple"
    chips
    solo
    flat
    :menu-props="{ closeOnContentClick: true }"
    :label="label && $t(label)"
    @update:modelValue="onChange"
  >
    <template #no-data>
      <query-prop-no-data></query-prop-no-data>
    </template>
  </v-select>
</template>

<script>
import QueryPropNoData from "@/components/SiteBuilder/Btn/QueryPropNoData.vue";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
export default {
  components: { QueryPropNoData },
  props: {
    modelValue: {
      type: [Array, Object],
      default: () => []
    },
    label: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: true
    },
    queryType: {
      type: String,
      default: "ANNOUNCEMENTS"
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  computed: {
    ...sync({ siteBuild: "builder/siteBuild" }),
    queries() {
      return this.queryType == "ANNOUNCEMENTS"
        ? this.siteBuild.queries.filter(query => query.type !== "STORES")
        : this.siteBuild.queries.filter(query => query.type === "STORES");
    }
  },
  methods: {
    ...mapMutations({ changeEditorTab: "builder/changeEditorTab" }),
    changeTab() {
      this.changeEditorTab("queries");
    },
    onChange(v) {
      if (!v) this.$emit("update:modelValue", null);
      else this.$emit("update:modelValue", v);
    }
  }
};
</script>

<style></style>
