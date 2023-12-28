<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-form @submit.prevent="submitFlag">
      <v-card :loading="loading > 0">
        <v-card-title>
          {{ $t("announcement.flag.title") }}
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="form.reason"
            :items="reasonList"
            item-title="text"
            item-value="value"
            variant="outlined"
            :label="$t('announcement.flag.reason')"
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-btn
            :aria-label="$t('_.cancel')"
            variant="text"
            @click="cancelFlag"
            >{{ $t("_.cancel") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            :aria-label="$t('_.submit')"
            type="submit"
            variant="text"
            color="primary"
            >{{ $t("_.submit") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import MessageBox from "@/mixins/MessageBox";

export default {
  mixins: [MessageBox],
  props: {
    announcement: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: 0,
      dialog: false,
      reasonList: [
        {
          value: "IDENTITY_THEFT",
          text: this.$t("announcement.flag.reasonList.IDENTITY_THEFT")
        },
        {
          value: "WRONG_PHONE",
          text: this.$t("announcement.flag.reasonList.WRONG_PHONE")
        },
        {
          value: "WRONG_CATEGORY",
          text: this.$t("announcement.flag.reasonList.WRONG_CATEGORY")
        },
        {
          value: "SCAM",
          text: this.$t("announcement.flag.reasonList.SCAM")
        },
        {
          value: "INAPPROPRIATE",
          text: this.$t("announcement.flag.reasonList.INAPPROPRIATE")
        },
        {
          value: "SPAM",
          text: this.$t("announcement.flag.reasonList.SPAM")
        }
      ],
      form: {
        reason: "INAPPROPRIATE"
      }
    };
  },

  methods: {
    open() {
      this.dialog = true;
    },

    cancelFlag() {
      this.dialog = false;
      this.form = {
        reason: "INAPPROPRIATE"
      };
    },
    async submitFlag() {
      this.loading++;

      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation Flag($id: ID!, $reason: AnnouncementFlagCause!) {
              announcementFlag(id: $id, reason: $reason)
            }
          `,
          variables: {
            id: this.announcement.id,
            reason: this.form.reason
          }
        });

        await this.$alert({
          title: this.$t("announcement.flag.submitFlagAlert.title"),
          message: this.$t("announcement.flag.submitFlagAlert.message"),
          icon: "mdi-alert",
          iconColor: "green"
        });
      } catch (error) {
        await this.$alert({
          title: this.$t("@.error.0"),
          message: this.$t("@.error.1")
        });
      }

      this.loading--;
      this.cancelFlag();
    }
  }
};
</script>

<style></style>
