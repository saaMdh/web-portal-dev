import BlockDefinitionDefault from "@/components/SiteBuilder/Blocks/BlockDefinitions/BlockDefinitionDefault";
import { defineAsyncComponent } from "vue";
export default {
  ...BlockDefinitionDefault,

  Contact: {
    title: "blockDefinitions.contact.title",
    icon: "mdi-message-bulleted",
    description: "blockDefinitions.contact.description",
    type: "Contact",
    default: {
      width: 1
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ContactBlock" */ "@/components/SiteBuilder/Blocks/Default/Contact/ContactBlock.vue"
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
            /* webpackChunkName: "HeaderBlock" */ "@/components/SiteBuilder/Blocks/Store/Header/HeaderBlock.vue"
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
            /* webpackChunkName: "MenuBlock1" */ "@/components/SiteBuilder/Blocks/Store/Menu/MenuBlock1.vue"
          )
        ),
        attrs: {}
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "MenuBlock2" */ "@/components/SiteBuilder/Blocks/Store/Menu/MenuBlock2.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Products: {
    title: "blockDefinitions.products.title",
    icon: "mdi-view-carousel",
    description: "blockDefinitions.products.description",
    type: "Products",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnouncementCarouselBlock" */ "@/components/SiteBuilder/Blocks/Store/AnnounCarousel/AnnouncementCarouselBlock.vue"
          )
        ),
        attrs: {
          count: 16,
          large: false
        }
      }
    ]
  },
  AnnounBrowserBlock: {
    title: "blockDefinitions.announBrowserBlock.title",
    icon: "mdi-table-large",
    description: "blockDefinitions.announBrowserBlock.description",
    type: "AnnounBrowserBlock",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnounBrowserBlock" */ "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  AnnounQueryListBlock: {
    title: "blockDefinitions.announQueryListBlock.title",
    icon: "mdi-table-large",
    description: "blockDefinitions.announQueryListBlock.description",
    type: "AnnounQueryListBlock",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnounQueryListBlock" */ "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounQueryListBlock.vue"
          )
        ),
        attrs: {
          count: 16,
          large: false,
          caption: true
        }
      }
    ]
  },

  AnnounBrowserQuery: {
    title: "blockDefinitions.announBrowserQuery.title",
    icon: "mdi-table-large",
    description: "blockDefinitions.announBrowserQuery.description",
    type: "AnnounBrowserQuery",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnounBrowserQuery" */ "@/components/SiteBuilder/Blocks/Store/AnnounBrowser/AnnounBrowserQuery.vue"
          )
        ),
        attrs: {
          count: 16,
          large: false
        }
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
  Searchbar: {
    title: "blockDefinitions.searchbar.title",
    icon: "mdi-feature-search-outline",
    description: "blockDefinitions.searchbar.description",
    type: "Searchbar",
    default: {
      width: 1,
      title: {
        fr: "Le titre",
        ar: "العنوان",
        en: "The title"
      },
      showTitle: false,
      showCategories: false
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "SearchBlock" */ "@/components/SiteBuilder/Blocks/Store/Search/SearchBlock.vue"
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
            /* webpackChunkName: "FooterBlock1" */ "@/components/SiteBuilder/Blocks/Store/Footer/FooterBlock1.vue"
          )
        ),
        attrs: {}
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FooterBlock2" */ "@/components/SiteBuilder/Blocks/Store/Footer/FooterBlock2.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  //Unshownblock

  Maps: {
    title: "blockDefinitions.maps.title",
    icon: "mdi-map-search-outline",
    description: "blockDefinitions.contact.description",
    type: "Maps",
    default: {
      width: 1
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "MapsBlock" */ "@/components/SiteBuilder/Blocks/Default/Maps/MapsBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  Social: {
    title: "blockDefinitions.social.title",
    icon: "mdi-facebook",
    description: "blockDefinitions.social.description",
    type: "Social",
    default: {
      title: {
        fr: "Suivez nous",
        ar: "تابعونا",
        en: "Follow us"
      },
      subtitle: {
        fr: "",
        ar: "",
        en: ""
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "SocialBlock" */ "@/components/SiteBuilder/Blocks/Store/Social/SocialBlock.vue"
          )
        )
      }
    ]
  }
};
