<template>
  <div>
    <v-select
      v-model="source"
      filled
      :label="$t('search.filter.triggers.title')"
      :items="sourceList"
      :item-title="item => $t(item.text)"
    ></v-select>
    <query-prop
      v-if="source == 'query'"
      :model-value="sourceValue"
      label="components.fields.queryField"
      query-type="STORES"
      :multiple="false"
      @update:modelValue="v => (sourceValue = v)"
    ></query-prop>
    <div v-else>
      <store-field
        v-if="source == 'storeIds'"
        :model-value="sourceValue"
        filled
        multiple
        solo
        clearable
        flat
        :label="label && $t(label)"
        @update:modelValue="v => updateStoreIds(v)"
      ></store-field>
    </div>
  </div>
</template>

<script>
import StoreField from "@/components/SiteBuilder/Fields/StoreField.vue";
import QueryProp from "@/components/SiteBuilder/Props/QueryProp.vue";

import { sync } from "vuex-pathify";
import get from "lodash/get";

export default {
  components: { QueryProp, StoreField },

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
          value: "storeIds",
          text: "components.fields.linkField.storeFieldLabel",
          icon: "mdi-card-bulleted"
        }
      ],
      source: get(this.modelValue, "source", "query"),
      sourceValue: get(this.modelValue, "sourceValue", [])
    };
  },

  computed: {
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
  },
  methods: {
    updateStoreIds(storeIds) {
      this.sourceValue = {
        q: "",
        filter: {
          storeIds: storeIds.map(x => {
            return parseInt(x);
          })
        }
      };
    }
  }
};
</script>

<style></style>
