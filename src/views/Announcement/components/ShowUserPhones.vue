<template>
  <div class="o-show-user-phones">
    <template v-if="announcement.contact">
      <!-- Social Buttons -->
      <v-list-item
        v-if="
          announcement.contact.viber.length > 0 ||
          announcement.contact.whatsapp.length > 0 ||
          announcement.contact.telegram.length > 0
        "
      >
        <template #prepend>
          <v-icon>mdi-message-text-fast</v-icon>
        </template>

        <div class="text-wrap text-capitalize d-flex flex-wrap flex-gap-2">
          <announ-btn-social
            v-if="announcement.contact.viber.length > 0"
            type="viber"
            :items="announcement.contact.viber"
            :announcement="announcement"
          ></announ-btn-social>
          <announ-btn-social
            v-if="announcement.contact.whatsapp.length > 0"
            type="whatsapp"
            :items="announcement.contact.whatsapp"
            :announcement="announcement"
          ></announ-btn-social>
          <announ-btn-social
            v-if="announcement.contact.telegram.length > 0"
            type="telegram"
            :items="announcement.contact.telegram"
            :announcement="announcement"
          ></announ-btn-social>

          <!-- <v-btn
            v-if="announcement.messengerLink"
            :href="announcement.messengerLink"
            depressed
            rounded="xl"
            dark
            color="#006AFF"
          >
            <v-icon left small>mdi-facebook-messenger</v-icon>
            Messenger
          </v-btn> -->
        </div>
      </v-list-item>

      <!-- Phones -->
      <v-list-item
        v-if="
          announcement.contact.phones.data.length &&
          (!announcement.dialogType || announcement.dialogType == 'call')
        "
      >
        <template #prepend>
          <v-icon>mdi-phone</v-icon>
        </template>
        <span>
          <v-btn
            v-for="item in announcement.contact.phones.data"
            :key="item.id"
            :href="`tel:${item.phone}`"
            class="px-3 me-1 mb-1"
            rounded
            depressed
            color="primary"
            @click="recordPhone(item.id)"
          >
            {{ item.phone }}
          </v-btn>
        </span>
      </v-list-item>

      <v-list-item v-else-if="announcement.dialogType == 'call'">
        <template #prepend>
          <v-icon>mdi-phone</v-icon>
        </template>
        <v-list-item-title>
          <v-chip color="primary" class="px-3 me-1 mb-1">
            {{ $t("announcement.user.noPhone") }}
          </v-chip>
        </v-list-item-title>
      </v-list-item>
    </template>

    <!-- Chat -->
    <v-list-item
      v-if="!announcement.dialogType || announcement.dialogType == 'message'"
    >
      <template #prepend>
        <v-icon>mdi-message-outline</v-icon>
      </template>

      <div class="text-wrap text-capitalize d-flex flex-wrap flex-gap-2">
        <announ-btn-chat
          :disabled="
            (user?.id && user?.id === announcement?.user?.id) || hasStore
          "
          elevation="0"
          color="blue-lighten-1 text-white"
          rounded
          :announcement="announcement"
          @click="$emit('close')"
        ></announ-btn-chat>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import AnnounBtnChat from "@/components/Announcement/Buttons/AnnounBtnChat.vue";
import AnnounBtnSocial from "@/components/Announcement/Buttons/AnnounBtnSocial.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
export default {
  components: {
    AnnounBtnSocial,
    AnnounBtnChat
  },
  props: {
    announcement: Object
  },
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  computed: {
    hasStore() {
      if (this.user && this.user.stores && Array.isArray(this.user.stores)) {
        for (let store in this.user.stores) {
          if (this.user.stores[store].id === this.announcement?.store?.id)
            return true;
        }
      }
      return false;
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
    }
  }
};
</script>
<style lang="scss">
.o-show-user-phones {
  .v-list-item__title {
    white-space: normal;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  &__blur {
    filter: blur(3px);
  }
}
</style>
