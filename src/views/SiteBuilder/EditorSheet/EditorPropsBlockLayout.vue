<template>
  <div
    v-if="selectedDefinition.layouts.length > 1"
    class="d-flex justify-space-between align-center pa-4"
  >
    <v-btn icon :disabled="!isAccessGranted('blocks')" @click="prevLayout">
      <v-icon>
        {{ $vuetify.locale.rtl ? "mdi-chevron-right" : "mdi-chevron-left" }}
      </v-icon>
    </v-btn>
    <span>
      {{
        $t("components.editorPropsBlockLayout.display") +
          " " +
          parseInt(selectedState.layout + 1)
      }}
      /{{ selectedDefinition.layouts.length }}
    </span>
    <v-btn icon :disabled="!isAccessGranted('blocks')" @click="nextLayout">
      <v-icon>
        {{ $vuetify.locale.rtl ? "mdi-chevron-left" : "mdi-chevron-right" }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { sync } from "vuex-pathify";

export default {
  computed: {
    ...sync({ editor: "builder/editor" }),
    ...mapGetters({
      selectedDefinition: "builder/selectedDefinition",
      selectedState: "builder/selectedState"
    })
  },

  methods: {
    ...mapMutations({ changeBlockLayout: "builder/changeBlockLayout" }),

    prevLayout() {
      const layout = Math.max(this.selectedState.layout - 1, 0);

      this.changeBlockLayout({
        index: this.editor.selected.index,
        bucket: this.editor.selected.bucket,
        layout
      });
    },

    nextLayout() {
      const layout = Math.min(
        this.selectedState.layout + 1,
        this.selectedDefinition.layouts.length - 1
      );

      this.changeBlockLayout({
        index: this.editor.selected.index,
        bucket: this.editor.selected.bucket,
        layout
      });
    }
  }
};
</script>

<style></style>
