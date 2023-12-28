export default {
  data() {
    return {
      templates: {
        features: [
          {
            title: { ar: "ميزات", fr: "Fonctionnalités", en: "Features" },
            image: {
              full: require("@/assets/blocks/FeaturesShowcase.png"),
              thumb: require("@/assets/default-no-image.svg")
            },
            attrs: {
              blocks: {
                "1": {
                  type: "Icon",
                  layout: 0,
                  attrs: {
                    icon: {
                      icon: "mdi-account",
                      link: "#",
                      color: "primary",
                      size: 6
                    }
                  }
                },
                "2": {
                  type: "Icon",
                  layout: 0,
                  attrs: {
                    icon: {
                      icon: "mdi-account-heart",
                      link: "#",
                      color: "primary",
                      size: 6
                    }
                  }
                },
                "3": {
                  type: "Icon",
                  layout: 0,
                  attrs: {
                    icon: {
                      icon: "mdi-assistant",
                      link: "#",
                      color: "primary",
                      size: 6
                    }
                  }
                },
                "4": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Titre1",
                      ar: "عنوان1",
                      en: "Title1",
                      textAlign: "center",
                      fontSize: 5,
                      textColor: null
                    }
                  }
                },
                "5": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Titre2",
                      ar: "عنوان2",
                      en: "Title2",
                      textAlign: "center",
                      fontSize: 5,
                      textColor: null
                    }
                  }
                },
                "6": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Titre3",
                      ar: "عنوان3",
                      en: "Title3",
                      textAlign: "center",
                      fontSize: 5,
                      textColor: null
                    }
                  }
                },
                "7": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Sous titre1",
                      ar: "العنوان الفرعي1",
                      en: "Subtitle1",
                      textAlign: "center",
                      fontSize: 2,
                      textColor: null
                    }
                  }
                },
                "8": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Sous titre2",
                      ar: "العنوان الفرعي2",
                      en: "Subtitle2",
                      textAlign: "center",
                      fontSize: 2,
                      textColor: null
                    }
                  }
                },
                "9": {
                  type: "Text",
                  layout: 0,
                  attrs: {
                    text: {
                      fr: "Sous titre3",
                      ar: "العنوان الفرعي3",
                      en: "Subtitle3",
                      textAlign: "center",
                      fontSize: 2,
                      textColor: null
                    }
                  }
                }
              },
              layouts: {
                md: [
                  { x: 3, y: 0, w: 2, h: 1, i: 1, moved: false },
                  { x: 11, y: 0, w: 2, h: 1, i: 2, moved: false },
                  { x: 19, y: 0, w: 2, h: 1, i: 3, moved: false },
                  { x: 2, y: 1, w: 4, h: 1, i: 4, moved: false },
                  { x: 10, y: 1, w: 4, h: 1, i: 5, moved: false },
                  { x: 18, y: 1, w: 4, h: 1, i: 6, moved: false },
                  { x: 2, y: 2, w: 4, h: 1, i: 7, moved: false },
                  { x: 10, y: 2, w: 4, h: 1, i: 8, moved: false },
                  { x: 18, y: 2, w: 4, h: 1, i: 9, moved: false }
                ],
                xs: [
                  { x: 3, y: 0, w: 2, h: 1, i: 1, moved: false },
                  { x: 3, y: 4, w: 2, h: 1, i: 2, moved: false },
                  { x: 3, y: 8, w: 2, h: 1, i: 3, moved: false },
                  { x: 2, y: 1, w: 4, h: 1, i: 4, moved: false },
                  { x: 2, y: 5, w: 4, h: 1, i: 5, moved: false },
                  { x: 2, y: 9, w: 4, h: 1, i: 6, moved: false },
                  { x: 2, y: 2, w: 4, h: 1, i: 7, moved: false },
                  { x: 2, y: 6, w: 4, h: 1, i: 8, moved: false },
                  { x: 2, y: 10, w: 4, h: 1, i: 9, moved: false }
                ]
              }
            }
          }
        ]
      }
    };
  }
};
