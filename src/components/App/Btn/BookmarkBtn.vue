<template>
  <v-menu
    v-model="active"
    v-bind="menuBind"
    :close-on-content-click="false"
    offset="10"
    location="bottom end"
    transition="slide-y-transition"
  >
    <template #activator="{ props }">
      <v-btn :aria-label="$t('topbar.bookmarks')" icon v-bind="props">
        <v-icon>mdi-bookmark</v-icon>
      </v-btn>
    </template>
    <v-card min-width="320" :elevation="4">
      <v-toolbar
        density="compact"
        :elevation="4"
        color="transparent"
        class="mb-2"
      >
        <v-toolbar-title>
          {{ $t("topbar.bookmarks") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          :aria-label="$t('_.close')"
          icon
          density="comfortable"
          @click="active = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-toolbar>
      <profile-bookmarks
        v-if="user"
        :key="bookmarksKey"
        :user="user"
      ></profile-bookmarks>
    </v-card>
  </v-menu>
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
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },

  data() {
    return {
      active: false,
      bookmarksKey: 0
    };
  },
  computed: {
    menuBind() {
      if (this.$isMobile) {
        return {
          width: "350",
          maxHeight: "500"
        };
      } else {
        return {
          width: "400",
          maxHeight: "600"
        };
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
  }
};
</script>
