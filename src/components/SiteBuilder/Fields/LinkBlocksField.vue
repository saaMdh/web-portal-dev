<template>
  <div>
    <v-select
      v-model="sourceType"
      filled
      :label="$t('components.fields.linkField.source')"
      :items="sourceList"
      :item-title="item => $t(item.text)"
    ></v-select>

    <template v-if="sourceType == 'blocks'">
      <div class="mb-3">
        {{ $t("components.fields.linkField.sourceList.3") }}
      </div>
      <v-autocomplete
        v-model="indexPage"
        :items="pageList"
        item-value="index"
        clearable
        dense
        filled
        :label="$t('components.fields.linkField.pageFieldLabel')"
      ></v-autocomplete>
      <v-select
        v-model="href"
        :items="blocks"
        :item-title="item => item.text"
        item-value="value"
        clearable
        dense
        filled
        :label="$t('components.fields.linkField.blocks')"
      ></v-select>
    </template>

    <template v-if="sourceType == 'pages'">
      <v-autocomplete
        v-model="href"
        :items="pageList"
        clearable
        dense
        filled
        :label="$t('components.fields.linkField.pageFieldLabel')"
      ></v-autocomplete>
    </template>

    <v-text-field
      v-model="href"
      :disabled="sourceType != 'link'"
      dense
      filled
      :label="$t('components.fields.linkField.linkFieldLabel')"
      clearable
    ></v-text-field>
  </div>
</template>

<script>
import BlockDefinition from "@/components/SiteBuilder/Blocks/BlockDefinition";
import { isStorePath } from "@/utils/location";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import { mapGetters } from "vuex";
import debounce from "lodash/debounce";
import map from "lodash/map";
export default {

  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },

  data() {
    return {
      sourceList: [
        {
          value: "blocks",
          text: "components.fields.linkField.sourceList.3",
          icon: "mdi-shape"
        },
        {
          value: "link",
          text: "components.fields.linkField.sourceList.0",
          icon: "mdi-open-in-new"
        },
        {
          value: "pages",
          text: "components.fields.linkField.sourceList.1",
          icon: "mdi-file-find"
        }
      ],
      block: null,
      sourceType: this.source()
    };
  },

  computed: {
    ...mapGetters({ pages: "builder/menuPages" }),
    href: {
      get() {
        return this.modelValue;
      },
      set: debounce(function(v) {
        this.$emit("update:modelValue", v);
      }, 400)
    },
    indexPage: {
      get() {
        return this.$store.state.builder.currentPageIndex || 0;
      },
      set(v) {
        return v;
      }
    },

    blocks() {
      const page = this.pages[this.indexPage];
      const href = this.$router.resolve({
        name: `${isStorePath(this.$route) ? "store" : "land"}-${page.slug}`
      }).path;
      return page.blocks
        .map((b, i) => ({
          value: `${href}#${b.type}-${i}`,
          type: b.type,
          text: this.$t(BlockDefinition()[b.type].title)
        }))
        .filter(b => b.type !== "ProductNavs");
    },

    pageList() {
      return map(this.pages, (p, index) => ({
        index,
        value: this.$router.resolve({
          name: `${isStorePath(this.$route) ? "store" : "land"}-${p.slug}`
        }).path,
        text: p.title[this.locale]
      }));
    }
  },
  mounted() {
    this.indexPage = this.firstIndexPage(this.modelValue);
  },
  methods: {
    source() {
      if (this.modelValue && this.modelValue.startsWith("/")) {
        if (this.modelValue.includes("#")) return "blocks";
        else return "pages";
      } else return "link";
    },
    firstIndexPage(href) {
      if (href) {
        const hrefPage = href.split("#")[0];
        const index = this.pageList.findIndex(el => el.value === hrefPage);
        return index;
      } else return this.$store.state.builder.currentPageIndex;
    }
  }
};
</script>

<style></style>
