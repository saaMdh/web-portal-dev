<template>
  <v-container fluid class="s-header-block">
    <div class="d-flex flex-gap-4 align-center">
      <div
        @click="
          to({
            name: `${isStorePath($route) ? 'store' : 'land'}-${homePage.slug}`
          })
        "
      >
        <v-img
          cover
          class="rounded-lg"
          :src="logoUrl"
          :width="$isDesktop ? 128 : 128 - 32"
        ></v-img>
      </div>

      <div>
        <template v-if="namePath === 'store-announcement-show'">
          <h2 class="text-h5 text-md-h4 font-weight-light">
            {{ store.storeName }}
          </h2>

          <h3 class="text-subtitle-2 text-md-subtitle-1">
            {{ store.description }}
          </h3>
        </template>
        <template v-else>
          <h1 class="text-h5 text-md-h4 font-weight-light">
            {{ store.storeName }}
          </h1>

          <h2 class="text-subtitle-2 text-md-subtitle-1">
            {{ store.description }}
          </h2>
        </template>

        <div class="d-flex flex-gap-2 flex-wrap mt-1 align-center">
          <subscribe-btn v-if="user"></subscribe-btn>
          <chat-with-button v-if="!hasStore"></chat-with-button>
          <template v-if="store.mainLocation">
            <div
              v-for="(item, index) in store.mainLocation.socials"
              :key="index"
            >
              <v-btn
                variant="text"
                icon
                density="comfortable"
                :href="item.url"
                target="_blank"
              >
                <social-icon :name="item.name" size="large"></social-icon>
              </v-btn>
            </div>
          </template>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import SubscribeBtn from "@/components/SiteBuilder/Btn/SubscribeBtn.vue";
import ChatWithButton from "@/views/SiteBuilder/QuickBar/ChatWithButton.vue";
import SocialIcon from "@ouedkniss/web-ui-plugin/src/components/Formatting/SocialIcon.vue";

import BlockHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import { isStorePath } from "@/utils/location";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { mapGetters } from "vuex";

export default {
  components: { SocialIcon, SubscribeBtn, ChatWithButton },

  mixins: [BlockHelperMixin],

  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  computed: {
    ...mapGetters({ store: "builder/store", homePage: "builder/homePage" }),
    logoUrl() {
      let url = this.store.imageUrl;
      if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "https://" + url;
      }
      return url;
    },
    namePath() {
      return this.$route.name;
    },

    hasStore() {
      if (
        this.user &&
        this.user.stores &&
        Array.isArray(this.user.stores) &&
        this.store
      ) {
        for (let store in this.user.stores) {
          if (this.user.stores[store].id === this.store.id) return true;
        }
      }
      return false;
    }
  },
  methods: {
    isStorePath,
    to(params) {
      this.$router.push(params);
    }
  }
};
</script>

<style lang="scss"></style>
