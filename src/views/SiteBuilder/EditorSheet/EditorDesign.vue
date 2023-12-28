<template>
  <div>
    <v-toolbar>
      <v-btn icon @click="changeEditorTab('pages')">
        <v-icon>
          {{ $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left" }}
        </v-icon>
      </v-btn>

      <v-toolbar-title>
        {{ $t("components.editorDesign.customize") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-list three-line>
      <v-list-item
        v-for="(item, index) in items"
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

        <v-list-item-title>
          {{ $t(item.title) }}
        </v-list-item-title>

        <v-list-item-subtitle style="-webkit-line-clamp: 2">
          {{ $t(item.subtitle) }}
        </v-list-item-subtitle>
      </v-list-item> </v-list
    ><v-list>
      <v-list-group no-action>
        <template #activator="{ props }">
          <v-list-item v-bind="props">
            <template #prepend>
              <v-icon size="32">mdi-image</v-icon>
            </template>
            <v-list-item-title>{{
              $t("editorPropsDefault.background")
            }}</v-list-item-title>
          </v-list-item>
        </template>
        <div class="ma-4">
          <color-field
            v-model="siteBuild.pages[currentPageIndex].backgroundColor"
            filled
            :label="$t('components.editorTheme.fields.backgroundColor')"
          ></color-field>

          <picture-prop
            v-model="siteBuild.pages[currentPageIndex].backgroundImg"
            class="mb-4"
          ></picture-prop>
        </div>

        <v-divider></v-divider>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import ColorField from "@/components/SiteBuilder/Fields/ColorField.vue";
import PictureProp from "@/components/SiteBuilder/Props/PictureProp.vue";

import Permission from "@/mixins/Permission";

import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";
export default {
  components: { ColorField, PictureProp },
  mixins: [Permission],

  data() {
    return {
      items: [
        {
          icon: "mdi-layers",
          title: "components.editorDesign.props.add.title",
          subtitle: "components.editorDesign.props.add.subtitle",
          bind: () => ({ disabled: !this.isAccessGranted("blocks") }),
          on: () => ({
            click: () => {
              this.toggleSectionAddDialog();
              this.hideEditor();
            }
          })
        }
      ]
    };
  },
  computed: {
    ...sync({
      siteBuild: "builder/siteBuild",
      currentPageIndex: "builder/currentPageIndex"
    })
  },

  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      toggleSectionAddDialog: "builder/toggleSectionAddDialog",
      hideEditor: "builder/hideEditor"
    })
  }
};
</script>

<style></style>
