<template>
  <div>
    <v-select
      v-model="sourceType"
      filled
      :label="$t('components.fields.linkField.source')"
      :items="sourceList"
      :item-title="item => $t(item.text)"
      class="mb-n4"
    ></v-select>

    <template v-if="sourceType == 'announcements'">
      <announ-field
        v-if="storeId"
        v-model="sourceAnnoun"
        :store-id="storeId"
        clearable
        return-object
        dense
        filled
        :label="$t('components.fields.linkField.announFieldLabel')"
        class="mb-n4"
      ></announ-field>
      <announ-field-queries
        v-else
        v-model="sourceAnnoun"
        :queries="queries"
        clearable
        return-object
        dense
        filled
        :label="$t('components.fields.linkField.announFieldLabel')"
        class="mb-n4"
      ></announ-field-queries>
    </template>

    <template v-if="sourceType == 'pages'">
      <v-autocomplete
        v-model="href"
        :items="pageList"
        clearable
        dense
        filled
        :label="$t('components.fields.linkField.pageFieldLabel')"
        class="mb-n4"
      ></v-autocomplete>
    </template>

    <v-text-field
      v-model="href"
      dense
      filled
      :label="$t('components.fields.linkField.linkFieldLabel')"
      clearable
      class="mb-n2"
    ></v-text-field>
  </div>
</template>

<script>
import AnnounFieldQueries from "@/components/SiteBuilder/Fields/AnnounFieldQueries.vue";
import AnnounField from "@/components/SiteBuilder/Fields/AnnounField.vue";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { isStorePath } from "@/utils/location";

import { mapGetters } from "vuex";
import { sync } from "vuex-pathify";
import debounce from "lodash/debounce";
import map from "lodash/map";
import get from "lodash/get";
export default {
  components: { AnnounField, AnnounFieldQueries },
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
          value: "link",
          text: "components.fields.linkField.sourceList.0",
          icon: "mdi-open-in-new"
        },
        {
          value: "pages",
          text: "components.fields.linkField.sourceList.1",
          icon: "mdi-file-find"
        },
        {
          value: "announcements",
          text: "components.fields.linkField.sourceList.2",
          icon: "mdi-card-bulleted"
        }
      ],

      sourceType: this.source(),
      sourceAnnoun: null
    };
  },

  computed: {
    ...sync({ siteBuild: "builder/siteBuild" }),
    queries() {
      return this.siteBuild.queries;
    },
    ...mapGetters({ store: "builder/store", pages: "builder/menuPages" }),

    href: {
      get() {
        return this.modelValue;
      },
      set: debounce(function (v) {
        this.$emit("update:modelValue", v);
      }, 400)
    },

    pageList() {
      return map(this.pages, p => ({
        value: this.$router.resolve({
          name: `${isStorePath(this.$route) ? "store" : "land"}-${p.slug}`
        }).path,
        title: p.title[this.locale]
      }));
    },

    storeId() {
      return get(this.store, "id");
    }
  },

  watch: {
    sourceAnnoun(announ) {
      let routeName = `${
        isStorePath(this.$route) ? "store" : "land"
      }-announcement-show`;
      if (announ) {
        this.href = this.$router.resolve({
          name: routeName,
          params: {
            slug: announ.slug,
            id: announ.id
          }
        }).path;
      } else this.href = "";
    }
  },
  methods: {
    source() {
      if (this.modelValue && this.modelValue.startsWith("/")) {
        const link = this.modelValue.split("/");
        if (link.includes("annonce")) return "announcements";
        else return "pages";
      } else return "link";
    }
  }
};
</script>

<style></style>
