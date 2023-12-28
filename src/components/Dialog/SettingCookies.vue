<template>
  <v-card height="600">
    <v-toolbar color="primary">
      <v-toolbar-title>{{ $t("@.cookies.contentTitel") }} </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="$emit('close')">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <div v-if="!active" class="d-flex flex-row">
      <v-tabs v-model="tab" direction="vertical" color="primary">
        <v-tab
          v-for="content in cookiesContent"
          :key="content.id"
          :value="content.id"
          class="text-subtitle-1"
          :width="$isMobile ? '20' : 'auto'"
          :min-width="$isMobile ? '20' : '90'"
        >
          <v-icon
            class="d-lg-flex d-md-block d-sm-block d-xl-block d-xl-block d-xl-block"
            start
            >{{ content.icon }}</v-icon
          >
          <div class="d-none d-sm-none d-md-none d-lg-block">
            {{ $t(content.title) }}
          </div>
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item
          v-for="content in cookiesContent"
          :key="content.id"
          :value="content.id"
        >
          <v-card
            flat
            style="padding: 25px; max-height: 400px; overflow-y: auto"
          >
            <v-row>
              <v-col>
                <v-card-title>
                  {{ $t(content.title) }}
                </v-card-title>
              </v-col>
            </v-row>
            <v-card-text>
              <p>{{ $t(content.description) }}</p>
              <p v-if="content.Identifiant">
                <span>Identifiant:</span>{{ content.Identifiant }} <br />
                Cet ID utilisateur sera utilisé comme identifiant unique lors du
                stockage et de l’accès à vos préférences pour l’avenir.
                <br />
                Horodatage: --
              </p>

              <a
                v-if="content.link == 'to a page cookies'"
                style="
                  cursor: pointer;
                  color: rgb(121, 121, 203);
                  text-decoration: underline;
                "
                @click="goToLink()"
                >{{ $t(content.linkLabel) }}</a
              >
              <a
                v-else
                target="_blank"
                style="
                  cursor: pointer;
                  color: rgb(121, 121, 203);
                  text-decoration: underline;
                "
                :href="content.link"
                >{{ $t(content.linkLabel) }}</a
              >
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
    <v-container v-if="active">
      <v-btn bottom variant="text" end fixed @click="goBack">
        <v-icon>{{
          $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left"
        }}</v-icon>
        Liste des cookies
      </v-btn>
      <v-card style="padding: 25px; max-height: 400px; overflow-y: auto">
        <div v-for="detail in cookiesDetails" :key="detail.id">
          <CookiesDetails :title="detail.title" :content="detail.content" />
        </div>
      </v-card>
    </v-container>
    <v-spacer></v-spacer>

    <v-card-actions class="flex-wrap">
      <v-btn :aria-label="$t('@.cookies.reject')" text @click="reject">{{
        $t("@.cookies.reject")
      }}</v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :aria-label="$t('@.cookies.acceptAll')"
        variant="text"
        color="primary"
        @click="accept"
        >{{ $t("@.cookies.acceptAll") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { COOKIES_CONTENT, COOKIES_DETAILS } from "./cookiesContent";

import CookiesDetails from "./CookiesDetails.vue";

export default {
  components: { CookiesDetails },

  data: () => ({
    tab: COOKIES_CONTENT[0],
    cookiesContent: COOKIES_CONTENT.map((content, index) => ({
      id: index,
      icon: content.icon,
      title: content.title,
      description: content.description,
      link: content.link,
      linkLabel: content.linkLabel,
      option: content.option,
      Identifiant: content.Identifiant
    })),

    cookiesDetails: COOKIES_DETAILS.map((detail, index) => ({
      id: index,
      title: detail.title,
      content: detail.content
    })),
    autoUpdate: true,
    active: false
  }),
  methods: {
    goToLink() {
      this.active = true;
    },
    goBack() {
      this.active = false;
    },
    accept() {
      this.$emit("accept");
    },
    reject() {
      this.$emit("reject");
    }
  }
};
</script>
<style scoped>
.v-card-title {
  text-overflow: initial;
  white-space: normal;
  word-break: none;
  word-wrap: none;
}
</style>
