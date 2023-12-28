<template>
  <div>
    <v-toolbar color="transparent" flat>
      <template v-if="config.showLogo">
        <media-editor
          v-model="config.logo"
          hide-link
          :style="$isDesktop ? 'height: 90%' : 'height: 75%'"
          @update="update"
        >
          <v-img
            :src="getImageSrc(media)"
            :lazy-src="getThumbImageSrc(media)"
            :contain="media.contain"
            :width="$isDesktop ? '200px' : '100px'"
            height="100%"
          ></v-img>
        </media-editor>
      </template>

      <v-toolbar-title v-else>
        {{ market.marketName }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <template v-if="$isMobile">
          <v-btn icon @click="expand = !expand"
            ><v-icon>mdi-menu</v-icon></v-btn
          >
        </template>

        <template v-if="$isDesktop">
          <v-btn
            v-for="item in menuPages"
            :key="item.slug"
            variant="text"
            @click="to({ name: `land-${item.slug}` })"
          >
            {{ item.title[$i18n.locale] }}
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>

    <template v-if="$isMobile">
      <v-expand-transition>
        <v-list v-if="expand">
          <v-list-item
            v-for="item in menuPages"
            :key="item.slug"
            :to="{ name: `land-${item.slug}` }"
            variant="text"
          >
            <v-list-item-title>{{
              item.title[$i18n.locale]
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-expand-transition>
    </template>
  </div>
</template>

<script>
import MediaEditor from "@/components/SiteBuilder/Editors/MediaEditor.vue";
import BooleanPropVue from "@/components/SiteBuilder/Props/BooleanProp.vue";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
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
    ...mapGetters({ market: "builder/market", menuPages: "builder/menuPages" }),
    media() {
      return this.$isDesktop
        ? get(this.config.logo, "desktop", this.config.logo)
        : get(this.config.logo, "mobile", this.config.logo);
    },
    logoUrl() {
      let url = this.market.logo;
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
    this.config.logo.image.full = this.logoUrl;
  },
  methods: {
    to(params) {
      this.$router.push(params);
    },
    getImageSrc(item) {
      return get(item, "image.full", require("@/assets/default-no-image.svg"));
    },

    getThumbImageSrc(item) {
      return get(item, "image.thumb", require("@/assets/default-no-image.svg"));
    }
  }
};
</script>
