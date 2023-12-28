import { isExternalDomain, isLandingPath, isStorePath } from "@/utils/location";
import { mapMutations } from "vuex";
import { sync } from "vuex-pathify";

export default {
  inject: ["getBlockInstance"],

  computed: {
    ...sync({
      editor: "builder/editor"
    }),

    isInSelectedBlock() {
      return (
        this.getBlockInstance() == this.editor.selected && this.editor.enable
      );
    },

    themeClasses() {
      return {
        // "v-theme--dark": this.$vuetify.theme.current.dark,
        // "v-theme--light": !this.$vuetify.theme.current.dark
      };
    },

    isActiveEditor() {
      return this.editor.inlineLock == this;
    }
  },

  methods: {
    ...mapMutations({
      changeEditorTab: "builder/changeEditorTab",
      setInlineLock: "builder/setInlineLock",
      hideEditor: "builder/hideEditor"
    }),
    getLink(link = "/") {
      // Add back compatibility with links missing /store at the beginning.
      if (!isExternalDomain() && link.startsWith("/")) {
        if (isStorePath(this.$route) && !link.startsWith("/store")) {
          this.modelValue.link = "/store" + link;
          return "/store" + link;
        } else if (isLandingPath(this.$route) && !link.startsWith("/landing")) {
          this.modelValue.link = "/landing" + link;
          return "/landing" + link;
        }
      }
      return link;
    },
    openEditor(event) {
      if (!this.isInSelectedBlock) return;
      event.preventDefault();
      event.stopPropagation();
      this.changeEditorTab("inline-editing");
      this.setInlineLock(this);
    },

    closeEditor() {
      this.changeEditorTab("props");
      this.setInlineLock(null);
    }
  }
};
