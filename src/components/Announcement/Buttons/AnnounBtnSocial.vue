<template>
  <div v-if="items.length > 0">
    <v-menu v-if="items.length > 1" offset-y>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :color="social.color"
          depressed
          rounded
          dark
          class="px-3 me-1 mb-1 text-white"
        >
          <v-icon size="small" start>{{ social.icon }} </v-icon>
          {{ social.label }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :href="
            social.link + item.phoneExt + social.text + getAnnouncementLink
          "
          @click="recordPhone(item.id)"
        >
          <v-icon class="me-2" :color="social.color">{{ social.icon }}</v-icon>

          {{ item.phone }}
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-else
      :color="social.color"
      depressed
      rounded
      dark
      class="px-3 text-white me-1 mb-1"
      :href="
        social.link + items[0].phoneExt + social.text + getAnnouncementLink
      "
      @click="recordPhone(items[0].id)"
    >
      <v-icon size="small" start>{{ social.icon }} </v-icon>
      {{ social.label }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    announcement: {
      type: Object,
      required: true
    }
  },
  computed: {
    social() {
      switch (this.type) {
        case "viber":
          return {
            icon: "mdi-viber",
            color: "#7360F2",
            //link: `viber://${this.isIOS() ? "add" : "chat"}?number=`,
            link: "viber://chat?number=",
            text: "&draft=",
            label: this.$t("announcement.viber")
          };
        case "whatsapp":
          return {
            icon: "mdi-whatsapp",
            color: "#25D366",
            link: "https://wa.me/",
            text: "?text=",
            label: this.$t("announcement.whatsapp")
          };
        case "telegram":
          return {
            icon: "mdi-telegram",
            color: "#0088cc",
            link: "https://t.me/",
            text: "/",
            label: this.$t("announcement.telegram")
          };
        default:
          return "";
      }
    },
    getAnnouncementLink() {
      return encodeURIComponent(
        "https://www.ouedkniss.com" +
          this.$router.resolve({
            name: "announcement_show",
            params: {
              id: this.announcement.id,
              slug: this.announcement.slug
            }
          }).fullPath
      );
    }
  },
  methods: {
    recordPhone(phoneId) {
      const context = {};
      if (this.$route.query.utm_source)
        context.utmSource = this.$route.query.utm_source;
      if (this.$route.query.utm_campain)
        context.utmCampain = this.$route.query.utm_campain;
      if (this.$route.query.utmMedium)
        context.utmSource = this.$route.query.utm_medium;
      this.$stats.recordPhoneClick(
        this.announcement.id,
        phoneId,
        Object.keys(context).length ? context : null
      );
    },
    isIOS() {
      return (
        (/iPad|iPhone|iPod/.test(navigator.platform) ||
          (navigator.platform === "MacIntel" &&
            navigator.maxTouchPoints > 1)) &&
        !window.MSStream
      );
    }
  }
};
</script>
