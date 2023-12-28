import { defineAsyncComponent } from "vue";

export default {
  Image: {
    title: "blockDefinitionsGrid.image.title",
    icon: "mdi-image",
    type: "Image",
    size: { h: 4, w: 4 },
    default: {
      width: 1,
      media: {
        desktop: {
          link: null,
          contain: false,
          autoSize: false,
          image: {
            full: `https://source.unsplash.com/640x480/?tech&` + Math.random(),
            thumb: require("@/assets/default-no-image.svg")
          }
        },
        mobile: {
          link: null,
          contain: false,
          autoSize: false,
          image: {
            full: `https://source.unsplash.com/640x480/?tech&` + Math.random(),
            thumb: require("@/assets/default-no-image.svg")
          }
        }
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Image" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Image.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Text: {
    title: "blockDefinitionsGrid.text.title",
    icon: "mdi-text",
    type: "Text",
    size: { h: 4, w: 4 },
    default: {
      text: {
        fr: "Proident non est ipsum est sint anim ex est id incididunt.",
        ar: "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو.",
        en: "Proident non est ipsum est sint anim ex est id incididunt. ",
        textAlign: null,
        fontSize: 1,
        textColor: null
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Text" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Text.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  Content: {
    title: "blockDefinitions.content.title",
    icon: "mdi-card-text-outline",
    type: "Content",
    size: { h: 4, w: 4 },
    default: {
      title: {
        fr: "Le titre",
        ar: "العنوان الرئيسي",
        en: "The title"
      },
      subtitle: {
        fr: "Le sous-titre",
        ar: "العنوان الثانوي",
        en: "The subtitle"
      },
      fontSize: 5,
      textColor: null,
      textAlign: null,
      buttons: [],
      buttonCount: 0
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Text" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Content.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  Video: {
    title: "blockDefinitions.video.title",
    icon: "mdi-youtube",
    type: "Video",
    size: { h: 4, w: 4 },
    default: {
      videoUrl: null
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Video" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Video.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  CustomVideo: {
    title: "blockDefinitions.customVideo.title",
    icon: "mdi-video",
    type: "CustomVideo",
    size: { h: 4, w: 4 },
    default: {
      media: []
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "CustomVideo" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/CustomVideo.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Carousel: {
    title: "blockDefinitions.carousel.title",
    icon: "mdi-play-box-outline",
    type: "Carousel",
    size: { h: 4, w: 4 },
    default: {
      width: 1,
      items: [
        {
          media: {
            desktop: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            },
            mobile: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            }
          }
        },
        {
          media: {
            desktop: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            },
            mobile: {
              link: null,
              contain: false,
              autoSize: false,
              image: {
                full:
                  `https://source.unsplash.com/640x480/?tech&` + Math.random(),
                thumb: require("@/assets/default-no-image.svg")
              }
            }
          }
        }
      ],
      count: 2,
      slidesPerView: 1,
      navigation: false,
      pagination: false,

      caption: true,
      autoplay: false
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Carousel" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Carousel.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  AnnouncementList: {
    title: "blockDefinitions.announBrowser.title",
    icon: "mdi-table-large",
    description: "blockDefinitions.announBrowser.description",
    type: "AnnouncementList",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "AnnouncementList" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/AnnouncementList.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Icon: {
    title: "blockDefinitionsGrid.icon.title",
    icon: "mdi-image",
    type: "Icon",
    size: { h: 4, w: 4 },
    default: {
      icon: {
        icon: "mdi-check",
        link: "#",
        color: "primary",
        size: 6
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Icon" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Icon.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  Features: {
    title: "blockDefinitions.features.title",
    icon: "mdi-star",
    type: "Features",
    size: { h: 8, w: 10 },
    default: {
      itemsCount: 4,
      items: [],
      showSubtitle: true
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Text" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Features.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Button: {
    title: "blockDefinitionsGrid.button.title",
    icon: "mdi-gesture-tap-button",
    type: "Button",
    size: { h: 4, w: 4 },
    default: {
      button: {
        link: "#",
        name: {
          fr: "Cliquer ici",
          ar: "أنقر هنا",
          en: "Click here"
        },
        style: "default",
        color: "primary"
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Button" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Button.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Map: {
    title: "blockDefinitions.maps.title",
    icon: "mdi-map-search-outline",
    type: "Map",
    size: { h: 4, w: 4 },
    default: {
      storeLocation: null
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Map" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Map.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  ContactInformation: {
    title: "blockDefinitionsGrid.ContactInformation.title",
    icon: "mdi-card-account-details",
    type: "ContactInformation",
    size: { h: 6, w: 6 },
    default: {
      storeLocation: null
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ContactInformation" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/ContactInformation.vue"
          )
        ),

        attrs: {}
      }
    ]
  },
  Spacer: {
    title: "blockDefinitions.spacer.title",
    icon: "mdi-arrow-expand-vertical",
    type: "Spacer",
    size: { h: 4, w: 4 },
    default: {},
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "Spacer" */ "@/components/SiteBuilder/Blocks/Default/Grid/Blocks/Spacer.vue"
          )
        ),
        attrs: {}
      }
    ]
  }
};
