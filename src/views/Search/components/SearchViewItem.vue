<template>
  <lazy
    :id="item.id"
    :class="
      item.__typename === 'Promotion' ? 'full-h o-center-mobile' : 'full-h'
    "
    :min-height="minHeight"
    :unrender="unrenderFlag"
  >
    <template #skeleton>
      <ok-card-loader :target="item.__typename"></ok-card-loader>
    </template>
    <template #default>
      <announcement-card
        v-if="item.__typename === 'Announcement'"
        :announcement="item"
        :fallback="fallback"
      ></announcement-card>

      <store-card-full
        v-if="item.__typename === 'Store'"
        :store="item"
      ></store-card-full>

      <v-card
        v-if="item.__typename === 'Promotion' && $isMobile"
        style="min-height: 250px; max-width: 600px"
        class="my-2 d-flex"
        color="transparent"
      >
        <promo-content
          :key="'MOBILE_LISTING_FEED' + $route.fullPath"
          width="300"
          height="250"
          :promo="item"
        ></promo-content>
      </v-card>

      <v-card
        v-else-if="item.__typename === 'Promotion'"
        class="d-flex"
        style="width: fit-content"
        color="transparent"
      >
        <promo-content
          :key="'DESKTOP_LISTING_FEED' + $route.fullPath"
          width="1300"
          height="150"
          :promo="item"
          class="my-3"
        ></promo-content>
      </v-card>
    </template>
  </lazy>
</template>

<script>
import PromoContent from "@/components/Promotion/PromoContent.vue";
import StoreCardFull from "@/components/Store/StoreCardFull.vue";
import AnnouncementCard from "@/components/Announcement/AnnouncementCard.vue";
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

const FALLBACK_IMG = {
  telephones: "telephones_bw.png",
  telephonie_accessoires: "telephones_bw.png",
  automobiles: "vehicules_bw.png",
  vehicules: "vehicules_bw.png",
  pieces_detachees: "vehicules_bw.png",
  immobilier: "immobilier_bw.png",
  electronique: "electronique_bw.png",
  emploi_demandes: "emploi_bw.png",
  emploi_offres: "emploi_bw.png",
  informatique: "informatique_bw.png",
  vetements: "mode_bw.png",
  accessoires_mode: "mode_bw.png",
  cosmetiques: "mode_bw.png",
  divers: "divers_bw.png",
  services: "services_bw.png",
  voyages: "voyages_bw.png",
  maison: "fourniture_bw.png",
  loisirs_divertissements: "loisirs_bw.png",
  materiaux_equipement: "materiaux_bw.png"
};

export default {
  components: { PromoContent, StoreCardFull, AnnouncementCard, okCardLoader },
  props: {
    item: {
      type: Object,
      required: true
    },

    index: {
      type: Number,
      default: 0
    },

    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      height: "45hv",
      fallback: ""
    };
  },
  computed: {
    minHeight() {
      let height;
      switch (this.item.__typename) {
        case "Announcement":
          height = "590";
          break;
        case "Store":
          height = "340";
          break;
        case "Promotion":
          height = "200";
          break;
      }
      return height;
    },
    unrenderFlag() {
      const LIMIT = this.$isMobile ? 4 : 8;
      return this.index >= LIMIT;
    }
  },
  async created() {
    const slug = this.category.slug;
    if (slug in FALLBACK_IMG)
      this.fallback = (
        await import(`@/assets/categories/${FALLBACK_IMG[slug]}`)
      ).default;
  }
};
</script>

<style lang="scss">
.o-center-mobile {
  text-align: -webkit-center !important;
}
</style>
