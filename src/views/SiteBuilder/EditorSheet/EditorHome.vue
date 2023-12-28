<template>
  <div class="o-editor-home">
    <v-list-subheader>{{ $t("editorHome.home") }}</v-list-subheader>

    <v-list three-line>
      <template v-for="(item, index) in items">
        <v-list-item
          v-if="item.show"
          v-bind="item.bind && item.bind()"
          :key="index"
          :class="item.class && item.class()"
          @click.stop
          v-on="item.on && item.on()"
        >
          <template #prepend>
            <v-avatar>
              <v-icon size="32">{{ item.icon }}</v-icon>
            </v-avatar>
          </template>
          <span>
            <v-list-item-title>
              {{ $t(item.title) }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ $t(item.subtitle) }}
            </v-list-item-subtitle>
          </span>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script>
import Permission from "@/mixins/Permission";

import { mapMutations } from "vuex";

export default {
  mixins: [Permission],

  data() {
    return {
      items: [
        {
          icon: "mdi-format-color-fill",
          title: "editorHome.siteTheme.title",
          subtitle: "editorHome.siteTheme.subtitle",
          show: true,
          bind: () => ({ disabled: !this.isAccessGranted("theme") }),
          on: () => ({ click: () => this.changeEditorTab("theme") })
        },
        {
          icon: "mdi-book-open-page-variant",
          title: "editorHome.pagesManagement.title",
          subtitle: "editorHome.pagesManagement.subtitle",
          show: true,
          bind: () => ({ disabled: !this.isAccessGranted("pages") }),
          on: () => ({ click: () => this.changeEditorTab("pages") })
        },
        {
          icon: "mdi-shape",
          title: "editorHome.queriesManagement.title",
          subtitle: "editorHome.queriesManagement.subtitle",
          show: true,
          bind: () => ({ disabled: !this.isAccessGranted("queries") }),
          on: () => ({ click: () => this.changeEditorTab("queries") })
        },
        {
          icon: "mdi-shopping",
          title: "editorHome.storeQueriesManagement.title",
          subtitle: "editorHome.storeQueriesManagement.subtitle",
          show: true,
          bind: () => ({ disabled: !this.isAccessGranted("storeQueries") }),
          on: () => ({ click: () => this.changeEditorTab("storeQueries") })
        },
        {
          icon: "mdi-cloud-check",
          title: "editorHome.publish.title",
          subtitle: "editorHome.publish.subtitle",
          show: true,
          bind: () => ({ disabled: !this.isAccessGranted("publish") }),
          on: () => ({ click: () => this.changeEditorTab("publish") })
        }
      ]
    };
  },

  methods: {
    ...mapMutations({ changeEditorTab: "builder/changeEditorTab" })
  }
};
</script>

<style lang="scss">
.o-editor-home {
  .v-list-item--disabled {
    opacity: 0.3;
  }
}
</style>
