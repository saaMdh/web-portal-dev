<template>
  <v-container fluid>
    <v-card class="s-search-block">
      <div v-if="config.showTitle" class="font-weight-light headline my-2">
        <text-editor v-model="config.title" @update:modelValue="update">
          <h3 class="font-weight-bold text-decoration-none">
            {{ config.title ? config.title[$i18n.locale] : "" }}
          </h3>
        </text-editor>
      </div>
      <v-card border>
        <search-field
          v-model="search.query"
          solo
          :placeholder="$t('components.searchBlock.fields.search')"
          @makeSearch="makeSearch"
        >
          <v-btn icon size="small" color="primary" @click="makeSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </search-field>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import SearchField from "@/components/SiteBuilder/Fields/SearchField.vue";
import TextEditor from "@/components/SiteBuilder/Editors/TextEditor.vue";

import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";

export default {
  components: {
    TextEditor,
    SearchField
  },
  mixins: [BlocksHelperMixin],

  editableProps: [
    {
      key: "showTitle",
      icon: "mdi-format-title",
      label: "components.searchBlock.props.showTitle",
      field: BooleanPropVue
    }
  ],

  data() {
    return {
      config: {
        title: {
          fr: "Le titre",
          ar: "العنوان الرئيسي",
          en: "The title"
        },
        showTitle: false
      },
      search: {
        query: "",
        categorySlug: null
      }
    };
  },

  methods: {
    makeSearch() {
      if (this.search.query.length < 3) return;

      this.$router
        .push({
          name: "store-announcement-search",
          query: {
            q: this.search.query,
            category: undefined
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
.s-search-block {
  margin: 2px black;
}
</style>
