<template>
  <v-btn
    v-bind="$attrs"
    :size="mini ? 'small' : 'default'"
    class="text-capitalize"
    variant="text"
    :loading="loading > 0"
    @click="openCallDialog()"
  >
    <v-icon :class="mini ? (type == 'call' ? 'me-1' : '') : 'me-1'">{{
      type == "call" ? "mdi-phone" : "mdi-message-text-outline"
    }}</v-icon>
    {{
      type == "call"
        ? $t("announcement.call")
        : !mini
        ? $t("announcement.message")
        : ""
    }}
  </v-btn>
</template>

<script>
import gql from "graphql-tag";
import useAnnounStatus from "./useAnnounStatus";
export default {
  props: {
    announcement: {
      type: Object,
      required: false
    },
    mini: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "call"
    }
  },
  setup(props) {
    const { checkAction } = useAnnounStatus(props);
    return { checkAction };
  },
  data() {
    return {
      loading: 0,
      contact: {
        phones: {
          data: []
        },
        whatsapp: [],
        viber: [],
        telegram: []
      }
    };
  },
  methods: {
    async openCallDialog() {
      if (this.loading) return;
      this.loading++;
      this.contact = {
        phones: {
          data: []
        },
        whatsapp: [],
        viber: [],
        telegram: []
      };
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
      this.loading--;
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
      if (
        this.type == "message" &&
        this.contact.viber.length == 0 &&
        this.contact.whatsapp.length == 0 &&
        this.contact.telegram.length == 0
      ) {
        this.checkAction("CHAT");
      } else {
        this.$store.commit("app/setAnnouncement", {
          ...this.announcement,
          ...{ contact: this.contact },
          ...{ dialogType: this.type }
        });
        return this.$store.commit("dialog/openDialog", {
          name: "modelCall"
        });
      }
    }
  }
};
</script>

<style></style>
