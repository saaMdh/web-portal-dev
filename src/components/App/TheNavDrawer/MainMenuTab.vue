<template>
  <ok-list>
    <!-- Dark Mode -->
    <ok-list-item v-once>
      <template #prepend>
        <v-icon>mdi-brightness-4</v-icon>
      </template>
      <template #title>
        {{ $t("meta.darkmode") }}
      </template>

      <template #append>
        <v-switch
          hide-details
          :model-value="darkMode"
          @click.stop="changeTheme"
        ></v-switch>
      </template>
    </ok-list-item>

    <ok-list-subheader inset>{{
      $t("topbar.account.title")
    }}</ok-list-subheader>
    <!-- Authenticated Menu -->
    <template v-if="user && !user.isAnonymous">
      <ok-list-item
        v-for="item in authenticated"
        :key="item.title"
        v-memo="[]"
        :title-bind="{ class: 'my-1' }"
        clickable
        @click="item.on"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <template #title>
          {{ item.title }}
        </template>
      </ok-list-item>
    </template>

    <!-- Anonymous Menu -->
    <template v-else-if="user && user.isAnonymous">
      <ok-list-item
        v-for="item in anonymous"
        :key="item.title"
        v-memo="[]"
        :title-bind="{ class: 'my-1' }"
        clickable
        @click="item.on"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <template #title>
          {{ item.title }}
        </template>
      </ok-list-item>
    </template>

    <!-- Visitor Menu -->
    <template v-else>
      <ok-list-item
        v-for="item in visitor"
        :key="item.title"
        v-memo="[]"
        :title-bind="{ class: 'my-1' }"
        clickable
        @click="item.on"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>

        <template #title>
          {{ item.title }}
        </template>
      </ok-list-item>
    </template>

    <!-- Categories Menu -->
    <ok-list-subheader inset>{{ $t("topbar.categories") }}</ok-list-subheader>
    <ok-list-item
      v-for="(item, index) in allCatgories"
      :key="index"
      v-memo="[allCatgories.length > 0]"
      clickable
      @click="browseCategory(item)"
    >
      <template #prepend>
        <category-img :category="item" width="36" />
      </template>
      <template #title>
        {{ item.name }}
      </template>
    </ok-list-item>

    <!-- Footer Links -->
    <ok-list-subheader inset>{{ $t("topbar.links") }}</ok-list-subheader>

    <ok-list-item
      v-for="(item, index) in footerlinks"
      v-once
      :key="index"
      clickable
      :title-bind="{ class: 'my-1' }"
      @click="item.on"
    >
      <template #title>
        {{ item.label }}
      </template>
    </ok-list-item>

    <v-divider class="my-3"></v-divider>
    <!-- Social Links -->
    <v-row dense justify="center">
      <v-col v-for="(item, index) in socials" :key="index" cols="2">
        <v-btn :aria-label="item.title" icon :href="item.url" target="_blank">
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </ok-list>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import SearchState, { QUERY_DEFAULT } from "@/views/Search/SearchState";

import useFooterLinks from "../TheFooter/useFooterLinks";
import SocialLinks from "../TheFooter/SocialLinks";

import useMainMenuLinks from "./useMainMenuLinks.js";
import assign from "lodash/assign";

export default {
  emits: ["toggle"],

  setup() {
    const { user, token, darkMode, manualTheme } = useAuthFrame();
    const {
      getUserLinks: authenticated,
      getAnonymousLinks: anonymous,
      getVisitorLinks: visitor
    } = useMainMenuLinks(user.value);
    const footerlinks = useFooterLinks();
    return {
      user,
      token,
      darkMode,
      manualTheme,
      authenticated,
      anonymous,
      visitor,
      footerlinks,
      socials: SocialLinks
    };
  },

  computed: {
    allCatgories() {
      return [
        {
          name: this.$t("home.stores.title"),
          icon: require("@/assets/market-icon.png"),
          slug: "boutiques"
        },
        ...this.$store.getters.categories
      ];
    }
  },

  methods: {
    changeTheme() {
      if (!this.manualTheme) this.manualTheme = true;
      this.darkMode = !this.darkMode;
    },
    browseCategory(item) {
      if (item.slug === "boutiques") {
        this.$router.push({
          name: "boutiques"
        });
        return;
      }
      assign(SearchState, QUERY_DEFAULT);
      SearchState.categorySlug = item.target.slug;

      this.$router.push({
        name: "search_category",
        params: { category: item.target.slug, page: 1 }
      });
    }
  }
};
</script>
