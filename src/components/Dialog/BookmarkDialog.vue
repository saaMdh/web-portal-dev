<template>
  <v-dialog v-model="active" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="transparent" elevation="3">
        <v-toolbar-title>{{ $t("topbar.bookmarks") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn :aria-label="$t('topbar.bookmarks')" icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <profile-bookmarks
        v-if="user"
        :key="bookmarksKey"
        :user="user"
        class="mt-2"
        @click="close"
      ></profile-bookmarks>
    </v-card>
  </v-dialog>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    ProfileBookmarks: defineAsyncComponent({
      delay: 1000,
      loader: () =>
        import(
          /* webpackPrefetch: true */ "@/views/Profile/ProfileBookmarks.vue"
        )
    })
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { user } = useAuthFrame();
    return {
      user
    };
  },
  data() {
    return {
      bookmarksKey: 0
    };
  },
  computed: {
    active: {
      get() {
        return this.$store.state.dialog.modelBookmarks;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelBookmarks" });
      }
    }
  },
  watch: {
    active: {
      handler(v) {
        if (v) {
          this.bookmarksKey++;
        }
      }
    }
  },

  methods: {
    close() {
      this.active = false;
    }
  }
};
</script>
