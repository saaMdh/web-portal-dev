<template>
  <v-container class="py-0">
    <template v-if="!megaMenu || !megaMenu.length">
      <mega-menu-loader></mega-menu-loader>
    </template>
    <div v-else class="o-mega-menu">
      <swiper
        :key="'mega-menu-' + $isDesktop + cover"
        v-slot="{ item }"
        :items="categories"
        item-value="id"
        :space-between="4"
        :slides-per-view="
          $r({
            lg: cover ? 7 : 9,
            md: 8,
            sm: 6,
            xs: 4
          })
        "
        :navigation-ex="$isDesktop && !cover"
        pagination
        :options="{
          grid: {
            fill: 'row',
            rows: 2,
            slidesPerGroup: $r({
              lg: cover ? 7 : 9,
              md: 8,
              sm: 6,
              xs: 4
            })
          },
          slidesPerGroup: $r({
            lg: cover ? 7 : 9,
            md: 8,
            sm: 6,
            xs: 4
          })
        }"
      >
        <component
          :is="component(item)"
          :to="goToLink(item)"
          :href="item.target.link"
          :aria-label="item.name"
          v-bind="backgoundBind()"
          class="v-card o-mega-menu__item v-card--link v-sheet"
        >
          <category-img
            :size="
              $r({
                xl: 80,
                lg: 80,
                md: 80,
                sm: 70,
                xs: 55
              })
            "
            :category="item"
            :style="
              item.target.link ? 'border-radius : 50% !important' : 'unset'
            "
          ></category-img>
        </component>
        <h2>{{ item.name }}</h2>
      </swiper>
    </div>
  </v-container>
</template>

<script>
import { MegaMenuLoader } from "./LoaderHome";
import { defineAsyncComponent } from "vue";
import gql from "graphql-tag";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
export default {
  components: {
    MegaMenuLoader,
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },
  props: {
    cover: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      megaMenu: [],
      service: "OTHER"
    };
  },
  computed: {
    categories() {
      let megaMenu = this.megaMenu;
      if (this.service === "OTHER") megaMenu = this.excludeDjezzy(megaMenu);
      megaMenu = sortBy(megaMenu, c => c.rank);
      return megaMenu;
    }
  },
  created() {
    this.internetServiceProvider();
  },
  methods: {
    async internetServiceProvider() {
      const { data } = await this.$apollo.query({
        fetchPolicy: "network-only",
        query: gql`
          query internetServiceProviderGet {
            internetServiceProviderGet: internetServiceProviderGet {
              service
            }
          }
        `
      });
      this.service = get(data, "internetServiceProviderGet.service", "OTHER");
    },
    backgoundBind() {
      return {
        style: {
          width: this.$r({
            lg: "80px",
            md: "80px",
            sm: "70px",
            xs: "55px"
          }),
          height: this.$r({
            lg: "80px",
            md: "80px",
            sm: "70px",
            xs: "55px"
          })
        }
      };
    },

    component(item) {
      if (
        item.target &&
        item.target.link &&
        item.target.link.startsWith("http")
      ) {
        return "a";
      } else {
        return "router-link";
      }
    },

    goToLink(item) {
      if (item.target.link && item.target.link.startsWith("http")) {
        return item.target.link;
      } else if (item.target.link && item.target.link.startsWith("/")) {
        return item.target.link;
      } else {
        return {
          name: "search_category",
          params: {
            category: item.target.slug,
            page: 1
          }
        };
      }
    },
    excludeDjezzy(megaMenu) {
      return megaMenu.filter(
        c => !get(c, "target.link", "").includes("djezzy")
      );
    }
  },

  apollo: {
    megaMenu: {
      fetchPolicy: "cache-and-network",
      query: gql`
        query megaMenu($menuFilter: MenuFilterInput) {
          megaMenu: menuFetch(menuFilter: $menuFilter) {
            id
            name
            icon {
              light
              dark
            }
            target {
              ... on TargetLink {
                link
              }
              ... on Category {
                id
                name
                slug
                icon
              }
              ... on SearchInput {
                q
              }
            }
            rank
          }
        }
      `,
      variables() {
        return {
          menuFilter: { menuType: "MEGA_MENU" }
        };
      },
      result({ data }) {
        this.megaMenu = get(data, "megaMenu", null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/responsive";

.o-mega-menu {
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  .v-card {
    border-radius: 50%;

    *:last-child {
      border-radius: unset !important;
    }

    @include isDesktop {
      width: 81px;
      height: 81px;
    }
    @include isSM {
      width: 71px;
      height: 71px;
    }
    @include isXS {
      width: 56px;
      height: 56px;
    }
    display: flex;
    align-items: center;
    margin: 0 auto;
    justify-content: center;
    border-radius: 50%;
  }

  span {
    height: 15px;
    text-align: center;
    display: block;
    width: 100%;
    margin: 5px 0px;
    border-radius: 10px;
  }

  h2 {
    @include isDesktop {
      line-height: 1em;
      font-weight: 400;
      font-size: 0.87rem;
    }
    @include isSM {
      line-height: 1.2;
      font-weight: 400;
      font-size: 0.75rem;
    }
    @include isXS {
      line-height: 1.2;
      font-weight: 300;
      font-size: 0.68rem;
    }
    margin-top: 7px;
    height: 29px;
    overflow-y: clip;
    word-wrap: normal;
    letter-spacing: -0.1px;
  }
}

.v-theme--light {
  .o-mega-menu {
    .v-card {
      &:hover {
        background: #e5e5e5;
      }
      background: #fff;
      box-shadow: 0 1px 1px #bbb !important;
    }

    span {
      background: #e5e5e5;
    }

    h2 {
      color: #333;
    }
  }
}

.v-theme--dark {
  .o-mega-menu {
    .v-card {
      &:hover {
        background: #151515;
      }
      background: #252525;
      box-shadow: 0 1px 2px #000 !important;
    }

    span {
      background: #252525;
    }

    h2 {
      color: #bbb;
    }
  }
}
</style>
