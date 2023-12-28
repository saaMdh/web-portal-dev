<template>
  <div>
    <v-select
      v-model="source"
      filled
      append-icon="mdi-chevron-down"
      :label="$t('search.filter.triggers.title')"
      :items="sourceList"
      :item-title="item => $t(item.text)"
    ></v-select>
    <query-prop
      v-if="source == 'query'"
      :model-value="sourceValue"
      label="components.fields.queryField"
      @update:modelValue="v => (sourceValue = v)"
    ></query-prop>
    <div v-else>
      <announ-field
        v-if="store"
        :model-value="sourceValue"
        filled
        multiple
        solo
        clearable
        flat
        :label="label && $t(label)"
        :store-id="store.id"
        @update:modelValue="v => (sourceValue = v)"
      ></announ-field>
      <announ-field-queries
        v-else
        :model-value="sourceValue"
        filled
        multiple
        solo
        clearable
        flat
        :label="label && $t(label)"
        @update:modelValue="v => (sourceValue = v)"
      ></announ-field-queries>
    </div>
  </div>
</template>

<script>
import AnnounFieldQueries from "@/components/SiteBuilder/Fields/AnnounFieldQueries.vue";
import AnnounField from "@/components/SiteBuilder/Fields/AnnounField.vue";
import QueryProp from "@/components/SiteBuilder/Props/QueryProp.vue";

import { mapGetters } from "vuex";
import { sync } from "vuex-pathify";
import get from "lodash/get";

export default {
  components: { QueryProp, AnnounField, AnnounFieldQueries },

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
  data() {
    return {
      sourceList: [
        {
          value: "query",
          text: "components.fields.linkField.query",
          icon: "mdi-arrange-send-to-back"
        },
        {
          value: "announce",
          text: "components.fields.linkField.announFieldLabel",
          icon: "mdi-card-bulleted"
        }
      ],
      source: get(this.modelValue, "source", "query"),
      sourceValue: get(this.modelValue, "sourceValue", [])
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" }),
    ...sync({ siteBuild: "builder/siteBuild" })
  },
  watch: {
    source: {
      deep: true,
      handler() {
        this.sourceValue = [];
      }
    },
    sourceValue: {
      deep: true,
      handler(v) {
        this.$emit("update:modelValue", {
          source: this.source,
          sourceValue: v
        });
      }
    }
  }
};
</script>

<style></style>
