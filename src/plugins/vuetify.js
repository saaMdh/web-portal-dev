import "@/fonts/mdi/css/materialdesignicons.css";

import { createVuetify } from "vuetify";
import "vuetify/styles";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

// Composables
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

import fr from "vuetify/lib/locale/fr";
import ar from "vuetify/lib/locale/ar";

const { locale } = useAuthFrame();
export const PRIMARY_COLOR = "#e95903";

export const SetPrimaryColor = (vm, color = PRIMARY_COLOR) => {
  vm.$vuetify.theme.themes.dark.primary = color;
  vm.$vuetify.theme.themes.dark.colors.primary = color;
  vm.$vuetify.theme.themes.light.primary = color;
  vm.$vuetify.theme.themes.light.colors.primary = color;
};
export const defaultThemes = () => {
  return {
    light: {
      colors: {
        primary: PRIMARY_COLOR,
        secondary: "#4285F4",
        accent: "#FBBC05",
        error: "#E00000",
        info: "#36a3f7",
        success: "#00DC6B",
        warning: "#FF6B00",
        background: "#F9F9F9",
        border: "#EAEDED"
      }
    },
    dark: {
      colors: {
        primary: PRIMARY_COLOR,
        secondary: "#4285F4",
        accent: "#FBBC05",
        error: "#D43838",
        info: "#36a3f7",
        success: "#00DC6B",
        warning: "#FF6B00",
        background: "#121212",
        border: "#1e1e1e",
        surface: "#272727"
      }
    }
  };
};

const vuetify = createVuetify({
  components: { VSkeletonLoader },
  defaults: {
    VBtn: { variant: "flat" },
    VProgressLinear: { color: "primary" },
    VBadge: { color: "primary" },
    VSelect: { variant: "solo-filled", color: "primary" },
    VCard: { elevation: 0 },
    VAutocomplete: { variant: "solo-filled", color: "primary" },
    VTextField: { variant: "solo-filled", color: "primary" },
    VTextarea: { variant: "solo-filled", color: "primary" }
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: defaultThemes()
  },
  icons: {
    iconfont: "mdi"
  },
  locale: {
    locale: locale.value,
    rtl: locale.value === "ar",
    messages: {
      fr,
      ar
    }
  }
});
export default vuetify;
