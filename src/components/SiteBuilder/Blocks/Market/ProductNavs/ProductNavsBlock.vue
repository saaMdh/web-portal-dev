<template>
  <v-container fluid class="s-header-block">
    <template>
      <v-slide-group show-arrows="desktop">
        <v-slide-group-item
          v-for="(_item, index) in config.items"
          :key="index"
          v-slot="{ toggle }"
        >
          <navs-editor
            :key="index"
            v-model="config.items[index]"
            @update:modelValue="update"
          >
            <v-btn
              rounded
              variant="outlined"
              color="primary"
              class="title-navs"
              @click="toggle"
            >
              <h2 class="mx-3">{{ _item.name[locale] }}</h2>
            </v-btn>
          </navs-editor>
        </v-slide-group-item>
      </v-slide-group>
    </template>
  </v-container>
</template>

<script>
import NavsEditor from "@/components/SiteBuilder/Editors/NavsEditor.vue";
import NumberPropVue from "@/components/SiteBuilder/Props/NumberProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import QueryMixin from "@/components/SiteBuilder/Blocks/Market/QueryMixin";

import { ensureItemsCount } from "@/utils/array";
import { sync } from "vuex-pathify";

export default {
  components: {
    NavsEditor
  },
  mixins: [QueryMixin, BlocksHelperMixin],
  editableProps: [
    {
      key: "itemsCount",
      icon: "mdi-format-list-numbered",
      label: "components.featureEditor.props.itemsCount",
      field: NumberPropVue,
      bind: {
        min: 1,
        max: 9
      }
    }
  ],
  data() {
    return {
      config: {
        items: [],
        itemsCount: 1
      },
      item: {
        link: "",
        name: { fr: "", ar: "", en: "" }
      }
    };
  },

  computed: {
    ...sync({ editor: "builder/editor" })
  },
  watch: {
    config: {
      handler() {
        this.config.items = ensureItemsCount(
          this.config.items,
          this.config.itemsCount,
          () => ({
            link: "",
            name: { fr: "", ar: "", en: "" }
          })
        );
      },
      immediate: true
    }
  },
  methods: {
    slugify: id => id.trim().split(" ").join("-")
  }
};
</script>

<style>
.title-navs {
  margin: 0px 2px 0px 2px;
}
.v-slide-group__content {
  display: flex;
  align-items: center;
  margin: 0px 5px 0px 5px;
}

.href-feature {
  text-decoration: none;
  color: inherit !important;
}
</style>
