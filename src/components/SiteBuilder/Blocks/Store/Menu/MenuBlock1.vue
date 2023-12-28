<template>
  <v-container class="py-0" fluid>
    <v-toolbar color="transparent" flat tile>
      <template v-if="config.showLogo">
        <media-editor
          v-model="config.logo"
          hide-link
          :style="$isDesktop ? 'height: 90%' : 'height: 75%'"
          @update="updateMedia"
        >
          <v-img
            style="cursor: pointer"
            :src="getImageSrc(media)"
            :lazy-src="getThumbImageSrc(media)"
            :contain="media.contain"
            :width="$isDesktop ? '200px' : '100px'"
            height="100%"
            @click="
              to({
                name: `${isStorePath($route) ? 'store' : 'land'}`
              })
            "
          ></v-img>
        </media-editor>
      </template>

      <v-toolbar-title v-else class="px-1">
        {{ store.storeName }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <template v-if="$isMobile">
          <v-btn icon @click="expand = !expand"
            ><v-icon>mdi-menu</v-icon></v-btn
          >
        </template>

        <template v-if="$isDesktop">
          <template v-for="item in menuPages" :key="item.slug">
            <v-btn variant="text" @click="to({ name: `store-${item.slug}` })">
              {{ item.title[$i18n.locale] }}
            </v-btn>
          </template>
        </template>
      </v-toolbar-items>
    </v-toolbar>

    <template v-if="$isMobile">
      <v-expand-transition>
        <v-list v-if="expand" class="mb-3 py-0" rounded>
          <template v-for="item in menuPages" :key="item.slug">
            <v-list-item
              variant="text"
              @click="to({ name: `store-${item.slug}` })"
            >
              <v-list-item-title>{{
                item.title[$i18n.locale].toUpperCase()
              }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-expand-transition>
    </template>
  </v-container>
</template>

<script>
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import { isStorePath } from "@/utils/location";

import { mapGetters } from "vuex";
import get from "lodash/get";

export default {
  components: { MediaEditor },
  mixins: [BlocksHelperMixin],

  editableProps: [
    {
      key: "showLogo",
      icon: "mdi-star-box",
      label: "components.menuBlock.props.showLogo",
      field: BooleanPropVue
    }
  ],

  data() {
    return {
      expand: false,
      config: {
        logo: {
          image: {
            full: `https://source.unsplash.com/640x480/?tech&` + Math.random(),
            thumb: require("@/assets/default-no-image.svg")
          },
          contain: false,
          link: "#"
        },
        showLogo: this.showLogo
      }
    };
  },

  computed: {
    ...mapGetters({
      store: "builder/store",
      menuPages: "builder/menuPages",
      homePage: "builder/homePage"
    }),
    media() {
      return this.$isDesktop
        ? get(this.config.logo, "desktop", this.config.logo)
        : get(this.config.logo, "mobile", this.config.logo);
    },
    logoUrl() {
      let url = this.store.imageUrl;
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "https://" + url;
      }
      return url;
    }
  },

  watch: {
    $route() {
      this.expand = false;
    }
  },
  mounted() {
    if (!this.config.logo.image.full)
      this.config.logo.image.full = this.logoUrl;
  },
  methods: {
    isStorePath,
    getImageSrc(item) {
      return get(item, "image.full", require("@/assets/default-no-image.svg"));
    },
    to(params) {
      this.$router.push(params);
    },
    getThumbImageSrc(item) {
      return get(item, "image.thumb", require("@/assets/default-no-image.svg"));
    },
    updateMedia(media) {
      this.config.logo.image = media.desktop.image;
      this.update();
    }
  }
};
</script>
<style>
.o-block .v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}
</style>
