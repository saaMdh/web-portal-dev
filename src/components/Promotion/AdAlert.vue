<template>
  <v-alert
    dense
    variant="outlined"
    shaped
    prominent
    color="deep-orange"
    icon="mdi-gift"
  >
    <span>{{ t("adText") }}</span>
  </v-alert>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  setup() {
    const { t } = useI18n({
      messages: {
        fr: {
          adText: "Utilisez un numéro djezzy et <b>gagnez 2 GO </b>"
        },
        ar: {
          adText: "استعملوا رقم هاتفي جازي و احصلوا على<b> 2GO مجانا </b>"
        },
        en: {
          adText: "Use a Djezzy phone number & <b> get 2 GO for free </b>"
        }
      }
    });
    return { t };
  }
};
</script>

<style></style>
