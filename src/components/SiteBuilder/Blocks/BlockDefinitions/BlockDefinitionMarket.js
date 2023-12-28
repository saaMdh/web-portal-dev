import BlockDefinitionDefault from "@/components/SiteBuilder/Blocks/BlockDefinitions/BlockDefinitionDefault";
import { defineAsyncComponent } from "vue";

export default {
  ...BlockDefinitionDefault,
  Products: {
    title: "blockDefinitions.announBrowser.title",
    icon: "mdi-view-comfy",
    description: "blockDefinitions.announBrowser.description",
    type: "Products",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnounQueryListBlock" */ "@/components/SiteBuilder/Blocks/Market/AnnounQuery/AnnounQueryListBlock.vue"
          )
        ),
        attrs: {
          count: 16,
          caption: true,
          large: false
        }
      }
    ]
  },

  ProductNavs: {
    title: "blockDefinitions.productnavs.title",
    icon: "mdi-current-dc",
    description: "blockDefinitions.productnavs.description",
    type: "ProductNavs",
    default: {
      width: 1,
      itemsCount: 4
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ProductNavsBlock" */ "@/components/SiteBuilder/Blocks/Market/ProductNavs/ProductNavsBlock.vue"
          )
        ),
        attrs: {
          count: 16,
          padding: 1,
          large: false
        }
      }
    ]
  },
  ProductCarousel: {
    title: "blockDefinitions.products.title",
    icon: "mdi-view-carousel",
    description: "blockDefinitions.products.description",
    type: "ProductCarousel",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnouncementCarouselBlock" */ "@/components/SiteBuilder/Blocks/Market/AnnounCarousel/AnnouncementCarouselBlock.vue"
          )
        ),
        attrs: {
          count: 16,
          large: false
        }
      }
    ]
  },
  StoreBrowser: {
    title: "blockDefinitions.storeBrowser.title",
    icon: "mdi-store",
    description: "blockDefinitions.storeBrowser.description",
    type: "StoreBrowser",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "StoreBrowser" */ "@/components/SiteBuilder/Blocks/Market/StoreBrowser/StoreBrowser.vue"
          )
        ),

        attrs: {}
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "StoreCarousel" */ "@/components/SiteBuilder/Blocks/Market/StoreBrowser/StoreCarousel.vue"
          )
        ),

        attrs: {}
      }
    ]
  },

  Header: {
    title: "blockDefinitions.header.title",
    icon: "mdi-page-layout-header",
    image: require("@/assets/logomark-h.svg"),
    description: "blockDefinitions.header.description",
    type: "Header",
    default: {
      backgroundColor: "#000000",
      backgroundColorOpacity: 80,
      width: 1
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "HeaderBlock" */ "@/components/SiteBuilder/Blocks/Market/Header/HeaderBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Menu: {
    title: "blockDefinitions.menu.title",
    icon: "mdi-navigation",
    description: "blockDefinitions.menu.description",
    type: "Menu",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "MenuBlock1" */ "@/components/SiteBuilder/Blocks/Market/Menu/MenuBlock1.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  ProductsShow: {
    title: "blockDefinitions.productsShow.title",
    icon: "mdi-newspaper-variant-outline",
    description: "blockDefinitions.productsShow.description",
    type: "ProductsShow",
    default: {
      width: 1,
      showComments: true,
      showDescription: true,
      showDelivery: true,
      showSpecs: true
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnounShow" */ "@/views/Announcement/Show.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Footer: {
    title: "blockDefinitions.footer.title",
    icon: "mdi-page-layout-footer",
    image: require("@/assets/logomark-h.svg"),
    description: "blockDefinitions.footer.description",
    type: "Footer",
    default: {
      backgroundColor: "#000000",
      backgroundColorOpacity: 80,
      width: 1
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FooterBlock1" */ "@/components/SiteBuilder/Blocks/Market/Footer/FooterBlock1.vue"
          )
        ),
        attrs: {}
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FooterBlock2" */ "@/components/SiteBuilder/Blocks/Market/Footer/FooterBlock2.vue"
          )
        ),
        attrs: {}
      }
    ]
  }
};
