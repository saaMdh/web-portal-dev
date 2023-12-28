import { defineAsyncComponent } from "vue";

export default {
  Grid: {
    title: "blockDefinitions.grid.title",
    icon: "mdi-view-grid-plus",
    description: "blockDefinitions.grid.description",
    type: "Grid",
    default: {
      layouts: {
        md: [],
        xs: []
      },
      blocks: {},
      width: 1,
      padding: 0
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GridBlock" */ "@/components/SiteBuilder/Blocks/Default/Grid/Grid.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  SimpleGrid: {
    title: "blockDefinitions.simpleGrid.title",
    icon: "mdi-view-column",
    description: "blockDefinitions.simpleGrid.description",
    type: "SimpleGrid",
    default: {
      blocks: [null, null],
      numBlock: 2,
      width: 1,
      padding: 0
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GridBlock" */ "@/components/SiteBuilder/Blocks/Default/Grid/SimpleGrid.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  Spacer: {
    title: "blockDefinitions.spacer.title",
    icon: "mdi-arrow-expand-vertical",
    description: "blockDefinitions.spacer.description",
    type: "Spacer",
    default: {
      padding: 2
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "SpacerBlock" */ "@/components/SiteBuilder/Blocks/Default/Spacer/SpacerBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },

  //Unshown Block

  Content: {
    title: "blockDefinitions.content.title",
    icon: "mdi-card-text-outline",
    description: "blockDefinitions.content.description",
    type: "Content",
    default: {
      width: 1,
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
      content: {
        fr: "Proident non est ipsum est sint anim ex est id incididunt. Do minim elit aliquip nisi laboris amet cillum ipsum excepteur elit. Proident culpa officia adipisicing consectetur consectetur incididunt duis aliqua. Magna exercitation eu tempor do cillum ullamco commodo quis deserunt. Dolor voluptate pariatur ex irure occaecat deserunt non ipsum.",
        ar: "لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات.",
        en: "Proident non est ipsum est sint anim ex est id incididunt. Do minim elit aliquip nisi laboris amet cillum ipsum excepteur elit. Proident culpa officia adipisicing consectetur consectetur incididunt duis aliqua. Magna exercitation eu tempor do cillum ullamco commodo quis deserunt. Dolor voluptate pariatur ex irure occaecat deserunt non ipsum."
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "HeadingBlock" */ "@/components/SiteBuilder/Blocks/Default/Content/HeadingBlock.vue"
          )
        ),
        attrs: {}
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "TextBlock" */ "@/components/SiteBuilder/Blocks/Default/Content/TextBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Image: {
    title: "blockDefinitions.image.title",
    icon: "mdi-image",
    description: "blockDefinitions.image.description",
    type: "Image",
    default: {
      width: 1,
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
      content: {
        fr: "Le contenu en text",
        ar: "المحتوى",
        en: "Text content"
      },
      media: {
        link: null,
        contain: true,
        autoSize: false,
        image: {
          full: "https://source.unsplash.com/640x450/?tech",
          thumb: require("@/assets/default-no-image.svg")
        }
      }
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ImageBlock" */ "@/components/SiteBuilder/Blocks/Default/Image/ImageBlock.vue"
          )
        ),
        attrs: {
          withText: false
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ImageBlock" */ "@/components/SiteBuilder/Blocks/Default/Image/ImageBlock.vue"
          )
        ),
        attrs: {
          withText: true
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "ImageBlockText" */ "@/components/SiteBuilder/Blocks/Default/Image/ImageBlockText.vue"
          )
        )
      }
    ]
  },
  Video: {
    title: "blockDefinitions.video.title",
    icon: "mdi-youtube",
    description: "blockDefinitions.video.description",
    type: "Video",
    default: {
      width: 1
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "VideoBlock" */ "@/components/SiteBuilder/Blocks/Default/Video/VideoBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Gallery: {
    title: "blockDefinitions.gallery.title",
    icon: "mdi-image-multiple",
    description: "blockDefinitions.gallery.description",
    type: "Gallery",
    default: {
      width: 1,
      itemsCount: 4,
      showCaption: true
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryGridBlock" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryGridBlock.vue"
          )
        ),
        attrs: {
          itemsCount: 2
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryRowBlock" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryRowBlock.vue"
          )
        ),
        attrs: {
          itemsCount: 5
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryRowSideBlock" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryRowSideBlock.vue"
          )
        ),
        attrs: {
          itemsCount: 3
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryRowBottomBlock" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryRowBottomBlock.vue"
          )
        ),
        attrs: {
          itemsCount: 6
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryRowMiddelBolck" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryRowMiddelBolck.vue"
          )
        ),
        attrs: {
          itemsCount: 4
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryRowMiddelBolck" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryRowMiddelBolck.vue"
          )
        ),
        attrs: {
          itemsCount: 3
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryGridSystem" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryGridSystem.vue"
          )
        ),
        attrs: {
          itemsCount: 3
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "GalleryGridType" */ "@/components/SiteBuilder/Blocks/Default/Gallery/GalleryGridType.vue"
          )
        ),
        attrs: {
          itemsCount: 5
        }
      }
    ]
  },
  Carousel: {
    title: "blockDefinitions.carousel.title",
    icon: "mdi-play-box-outline",
    description: "blockDefinitions.carousel.description",
    type: "Carousel",
    default: {
      width: 1,
      count: 2,
      caption: true
    },
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "CarouselBlock" */ "@/components/SiteBuilder/Blocks/Default/Carousel/CarouselBlock.vue"
          )
        ),
        attrs: {}
      }
    ]
  },
  Features: {
    title: "blockDefinitions.features.title",
    icon: "mdi-star",
    description: "blockDefinitions.features.description",
    type: "Features",
    layouts: [
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FeaturesBlock1" */ "@/components/SiteBuilder/Blocks/Default/Features/FeaturesBlock1.vue"
          )
        ),
        attrs: {
          itemsCount: 4
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FeaturesBlock2" */ "@/components/SiteBuilder/Blocks/Default/Features/FeaturesBlock2.vue"
          )
        ),
        attrs: {
          itemsCount: 4,
          mediaUrl: require("@/assets/logomark-h.svg")
        }
      },
      {
        component: defineAsyncComponent(() =>
          import(
            /* webpackChunkName: "FeaturesBlock3" */ "@/components/SiteBuilder/Blocks/Default/Features/FeaturesBlock3.vue"
          )
        ),
        attrs: {
          itemsCount: 4
        }
      }
    ]
  }
};
