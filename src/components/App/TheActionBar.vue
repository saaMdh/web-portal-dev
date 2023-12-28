<template>
  <v-bottom-navigation class="o-action-bar" height="50">
    <v-btn
      v-if="user"
      class="px-0"
      :aria-label="$t('topbar.bookmarks')"
      @click.stop="openBookmarksDialog()"
    >
      <v-icon>mdi-bookmark</v-icon>
      <span>{{ $t("topbar.bookmarks") }}</span>
    </v-btn>

    <v-btn
      class="px-0"
      :aria-label="$t('topbar.categories')"
      @click.stop="openCategoriesDialog()"
    >
      <v-icon>mdi-widgets</v-icon>
      <span>{{ $t("topbar.categories") }}</span>
    </v-btn>

    <v-btn
      class="px-0"
      :aria-label="$t('topbar.search.submit')"
      @click.stop="openSearchDialog()"
    >
      <v-icon>mdi-magnify</v-icon>
      <span>{{ $t("topbar.search.submit") }}</span>
    </v-btn>

    <messenger-btn
      v-if="showMessenger"
      :enable="$store.state.app.pluginsStatus === 'CONNECTED'"
    ></messenger-btn>

    <v-btn
      class="px-0"
      :aria-label="$t('topbar.announcements')"
      @click.stop="publish"
    >
      <v-icon>mdi-plus-circle-outline</v-icon>
      <span>{{ $t("topbar.announcements") }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import MessengerBtn from "./Btn/MessengerBtn.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import env from "@/utils/env.js";

export default {
  components: { MessengerBtn },

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  computed: {
    showMessenger() {
      return (
        this.user &&
        !this.user.isAnonymous &&
        !parseInt(env.VUE_APP_DISABLE_MESSENGER)
      );
    }
  },

  methods: {
    openSearchDialog() {
      return this.$store.commit("dialog/openDialog", {
        name: "modelSearch"
      });
    },
    openCategoriesDialog() {
      return this.$store.commit("dialog/openDialog", {
        name: "modelCategories"
      });
    },
    openBookmarksDialog() {
      return this.$store.commit("dialog/openDialog", {
        name: "modelBookmarks"
      });
    },
    publish() {
      return this.$router.push({ name: "publish" });
    }
  }
};
</script>
<style lang="scss">
.o-action-bar {
  .v-btn {
    padding: 0;
    margin: 0 4px 0px 4px;
    min-width: 60px !important;
    font-size: 0.7rem !important;
  }
}
</style>
