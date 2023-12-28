<template>
  <v-card
    id="announcementUserInfo"
    class="o-show-user-info rounded-lg"
    :loading="loading > 0"
    :disabled="loading > 0"
    variant="outlined"
  >
    <v-list flat>
      <!-- User -->
      <v-list-item
        v-if="!announcement.isFromStore"
        :to="{
          name: 'profile',
          params: { id: announcement.user.id }
        }"
      >
        <template #prepend>
          <v-icon>mdi-account</v-icon>
        </template>

        <v-list-item-title>
          {{ displayName }}
        </v-list-item-title>
      </v-list-item>

      <!-- Location -->
      <v-list-item v-if="announcement.cities.length > 0">
        <template #prepend>
          <v-icon>mdi-map-marker</v-icon>
        </template>

        <div class="py-2 text-wrap text-capitalize d-flex flex-wrap flex-gap-2">
          <template v-if="announcement.cities.length > 1">
            <template v-for="(l, index) in announcement.cities">
              <v-card
                v-if="index < 4 || showMoreStates"
                :key="l.id"
                flat
                class="rounded-xl px-2 py-1"
                :class="{
                  'grey-darken-3': $vuetify.theme.current.dark,
                  'grey-lighten-3': !$vuetify.theme.current.dark
                }"
              >
                {{ l.region.name }} - {{ l.name }}
              </v-card>
            </template>
            <v-card
              v-if="announcement.cities.length > 4 && !showMoreStates"
              variant="text"
              class="rounded-xl px-2 py-1"
              flat
              :class="{
                'grey-darken-3': $vuetify.theme.current.dark,
                'grey-lighten-3': !$vuetify.theme.current.dark
              }"
              @click="showMoreStates = true"
            >
              {{ $t("announcement.more_states") }} ... (
              {{ announcement.cities.length - 4 }} )
            </v-card>
          </template>
          <template v-else>
            <v-card flat>
              {{ announcement.cities[0].region.name }} -
              {{ announcement.cities[0].name }}
            </v-card>
          </template>
        </div>
      </v-list-item>

      <!-- Street Name -->
      <v-list-item v-if="announcement.street_name">
        <template #prepend>
          <v-icon>mdi-home-map-marker</v-icon>
        </template>

        <div class="text-wrap text-capitalize d-flex flex-wrap flex-gap-2">
          {{ displayAddress }}
        </div>
      </v-list-item>

      <!-- Phones -->
      <show-user-phones
        v-if="announcement.hasPhone"
        v-intersect="unhidePhone"
        :announcement="{
          ...announcement,
          ...{ contact: contact }
        }"
      ></show-user-phones>

      <!-- Email -->
      <v-list-item v-if="announcement.hasEmail" v-intersect="unhideEmail">
        <template #prepend>
          <v-icon>mdi-at</v-icon>
        </template>

        <v-list-item-title
          v-if="contact.email.hidden"
          class="o-show-user-info__blur"
        >
          <v-chip link>contact@ouedkniss.com</v-chip>
        </v-list-item-title>

        <template v-else>
          <v-list-item-title v-if="contact.email.data">
            <v-chip
              :class="{
                'grey-darken-3': $vuetify.theme.current.dark,
                'grey-lighten-3': !$vuetify.theme.current.dark
              }"
              :href="`mailto:${contact.email.data}`"
              >{{ contact.email.data }}
            </v-chip>
          </v-list-item-title>
          <v-list-item-title v-else>
            <v-chip>Aucun email</v-chip>
          </v-list-item-title>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import get from "lodash/get";

import { defineAsyncComponent } from "vue";

export default {
  components: {
    ShowUserPhones: defineAsyncComponent(() => import("./ShowUserPhones"))
  },
  props: {
    announcement: Object
  },

  data() {
    return {
      loading: 0,
      showMoreStates: false,
      contact: {
        phones: {
          data: [],
          hidden: true
        },
        email: {
          data: null,
          hidden: true
        },
        whatsapp: [],
        viber: [],
        telegram: []
      }
    };
  },
  computed: {
    displayName() {
      return this.HTMLEncode(get(this.announcement, "user.displayName", ""));
    },
    displayAddress() {
      return this.HTMLEncode(this.announcement.street_name);
    }
  },

  methods: {
    async unhideEmail() {
      if (!this.contact.email.hidden || this.loading) return;
      this.loading++;
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          query UnhideEmail($id: ID!) {
            email: announcementEmailGet(id: $id)
          }
        `,
        variables: { id: this.announcement.id }
      });

      this.loading--;
      this.contact.email.data = data.email;
      this.contact.email.hidden = false;
    },
    async unhidePhone() {
      if (!this.contact.phones.hidden || this.loading) return;
      this.loading++;
      const { data } = await this.$apollo.mutate({
        mutation: gql`
          query UnhidePhone($id: ID!) {
            phones: announcementPhoneGet(id: $id) {
              id
              phone
              phoneExt
              hasViber
              hasWhatsapp
              hasTelegram
            }
          }
        `,
        variables: { id: this.announcement.id }
      });

      this.contact.phones.hidden = false;
      this.contact.phones.data = data.phones;
      Array.prototype.forEach.call(data.phones, x => {
        if (x.hasViber)
          this.contact.viber.push({
            id: x.id,
            phone: x.phone,
            phoneExt: x.phoneExt.replace("+", "")
          });
        if (x.hasWhatsapp)
          this.contact.whatsapp.push({
            id: x.id,
            phone: x.phone,
            phoneExt: x.phoneExt.replace("+", "")
          });
        if (x.hasTelegram)
          this.contact.telegram.push({
            id: x.id,
            phone: x.phone,
            phoneExt: x.phoneExt
          });
      });
      this.loading--;
    },
    HTMLEncode(str) {
      return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode);
      });
    }
  }
};
</script>

<style lang="scss">
.o-show-user-info {
  border-color: rgb(var(--v-theme-primary)) !important;
  .v-list-item__title {
    white-space: normal;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
@media print {
  .o-show-user-info {
    border: none !important;
  }
}
</style>
