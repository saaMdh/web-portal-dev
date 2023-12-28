<template>
  <div>
    <v-bottom-sheet v-model="active">
      <v-sheet height="300px">
        <v-card tile>
          <v-card-title class="d-flex justify-space-between">
            <span>Partage</span>

            <v-btn :aria-label="$t('_.close')" icon @click="active = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-card-title>
          <v-card-actions>
            <swiper
              v-slot="{ item }"
              :items="providers"
              :navigation="!$isMobile"
              fill-height
              :slides-per-view="$r({ lg: 12, md: 10, sm: 10, xs: 5 })"
              :space-between="0"
            >
              <a
                :href="item.href"
                target="_blank"
                class="me-3 ms-3 text-decoration-none"
                :class="{
                  'text-white': $vuetify.theme.current.dark,
                  'text-black': !$vuetify.theme.current.dark
                }"
                elevation="2"
              >
                <v-img
                  :src="item.img"
                  max-height="40"
                  max-width="40"
                  class="ma-auto"
                  contain
                ></v-img>

                <div class="mt-3 text-center">
                  <p>
                    <small>{{ item.label }}</small>
                  </p>
                </div>
              </a>
            </swiper>
          </v-card-actions>

          <v-divider></v-divider>

          <div class="mx-5 my-2">
            <v-btn
              :aria-label="t('copy')"
              icon
              class="text-center"
              @click="copy"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
            <p>
              <small>{{ t("copy") }}</small>
            </p>
          </div>
        </v-card>
      </v-sheet>
    </v-bottom-sheet>

    <v-snackbar
      v-model="toast.active"
      bottom
      @click.stop="toast.active = false"
    >
      <span>{{ toast.message }}</span>

      <template #action>
        <v-btn
          :aria-label="$t('_.close')"
          icon
          size="small"
          @click.stop="toast.active = false"
        >
          <v-icon size="small">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import BuildUrl from "build-url";
import ClipboardMixin from "@/mixins/ClipboardMixin";
import { Plugins } from "@capacitor/core";
import { defineAsyncComponent } from "vue";
import { VBottomSheet } from "vuetify/labs/VBottomSheet";

const { Clipboard, Device } = Plugins;
import { useI18n } from "vue-i18n";

export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    ),
    VBottomSheet
  },
  mixins: [ClipboardMixin],
  props: {
    announcement: {
      type: Object,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const { t } = useI18n({
      messages: {
        fr: {
          copy: "Copier",
          copySuccess: "Lien copié"
        },
        ar: {
          copy: "نسخ الرابط",
          copySuccess: "تم نسخ الرابط"
        },
        en: {
          copy: "Copy link",
          copySuccess: "Link copied"
        }
      }
    });
    return { t };
  },

  data() {
    return {
      toast: {
        active: false,
        message: ""
      },

      providers: [
        {
          label: "Facebook",
          href: BuildUrl("https://facebook.com/sharer/sharer.php", {
            queryParams: { u: location.href }
          }),
          img: require("@/assets/socialShare/facebook.png")
        },
        {
          label: "Whatsapp",
          href: BuildUrl("whatsapp://send?", {
            queryParams: { text: location.href }
          }),
          img: require("@/assets/socialShare/whatsapp.png")
        },
        {
          label: "Viber",
          href: BuildUrl("viber://forward?", {
            queryParams: { text: location.href }
          }),
          img: require("@/assets/socialShare/viber.png")
        },
        {
          label: "Messenger",
          href: BuildUrl("fb-messenger://share/?", {
            queryParams: { link: location.href }
          }),
          img: require("@/assets/socialShare/facebook-messenger.png")
        },
        {
          label: "Telegram",
          href: BuildUrl("https://t.me/share/url?", {
            queryParams: { url: location.href }
          }),
          img: require("@/assets/socialShare/telegram.png")
        },
        {
          label: "Twitter",
          href: BuildUrl("https://twitter.com/intent/tweet", {
            queryParams: { url: location.href }
          }),
          img: require("@/assets/socialShare/twitter.png")
        },
        {
          label: "LinkedIn",
          href: BuildUrl("https://www.linkedin.com/shareArticle", {
            queryParams: {
              url: location.href
            }
          }),
          img: require("@/assets/socialShare/linkedin.png")
        },
        {
          label: "Email",
          href: BuildUrl("mailto:", {
            queryParams: {
              subject: this.announcement.title,
              body: location.href
            }
          }),
          img: require("@/assets/socialShare/google.png")
        },
        {
          label: "SMS",
          href: BuildUrl("sms:", {
            queryParams: { body: location.href }
          }),
          img: require("@/assets/socialShare/sms.png")
        }
      ]
    };
  },

  computed: {
    active: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    },
    url() {
      return location.href;
    }
  },

  async mounted() {
    this.deviceInfo = await Device.getInfo();
  },

  methods: {
    open() {
      this.active = true;
    },

    copy() {
      if (this.deviceInfo.platform === "web") {
        this.copyToClipboard(document.location.href);
      } else {
        Clipboard.write({
          string: document.location.href
        });
      }
      this.active = false;

      this.toast.active = true;
      this.toast.message = this.t("copySuccess");
    }
  }
};
</script>

<style></style>
