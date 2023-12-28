<template>
  <full-screen-frame>
    <template #title>
      <div class="o-publish__toolbar">
        <v-btn :aria-label="$t('_.cancel')" icon @click="cancel">
          <v-icon>{{
            $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left"
          }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-toolbar-title>{{ t("titlePicture") }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$isDesktop">
          <v-btn
            :aria-label="$t('publish.publish')"
            color="primary"
            :disabled="!canContinue"
            @click.stop="submit"
          >
            <v-icon>{{
              $vuetify.locale.rtl ? "mdi-arrow-left" : "mdi-arrow-right"
            }}</v-icon>
          </v-btn>
        </template>
      </div>
    </template>

    <template
      v-if="$apollo.queries.announcementCreateCategoryGet.loading === true"
    >
      <div class="d-flex justify-center align-center full-h pa-10">
        <v-progress-circular
          color="primary"
          size="64"
          width="3"
          indeterminate
        ></v-progress-circular>
      </div>
    </template>

    <template>
      <div v-if="canContinue" class="pa-4 o-publish__content">
        <media-uploader-field
          ref="picture"
          v-model="form.medias"
          :token="token"
          multiple
          type="announcement-image"
        ></media-uploader-field>
      </div>

      <div
        v-else
        class="d-flex justify-center align-center full-h o-publish__content"
      >
        <data-placeholder
          class="px-8"
          icon="mdi-account-cancel"
          :scale="0.5"
          center
        >
          {{ $t("publish.allowedAnnouncement.title") }}
        </data-placeholder>
      </div>

      <template v-if="$isMobile">
        <v-btn
          :aria-label="$t('publish.publish')"
          fab
          fixed
          end
          bottom
          color="primary"
          @click.stop="submit"
        >
          <v-icon>{{
            $vuetify.locale.rtl ? "mdi-arrow-left" : "mdi-arrow-right"
          }}</v-icon>
        </v-btn>
      </template>
    </template>
  </full-screen-frame>
</template>

<script>
import MediaUploaderField from "@ouedkniss/web-ui-plugin/src/components/Field/MediaUploaderField.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import PublishStore from "./PublishStore";
import FullScreenFrame from "@ouedkniss/web-ui-plugin/src/components/Misc/FullScreenFrame.vue";
import gql from "graphql-tag";
import { useI18n } from "vue-i18n";

export default {
  components: {
    FullScreenFrame,
    MediaUploaderField
  },
  props: {
    step: {
      type: Number,
      required: true
    }
  },

  setup() {
    const { token } = useAuthFrame();
    const { t } = useI18n({
      messages: {
        fr: {
          titlePicture: "Ajouter une photo"
        },
        ar: {
          titlePicture: "أضف صورة"
        },
        en: {
          titlePicture: "Add a picture"
        }
      }
    });
    return {
      token,
      t
    };
  },

  data() {
    return {
      form: PublishStore,
      canContinue: false
    };
  },

  watch: {
    "form.medias"() {
      if (this.form.medias.length > 0)
        this.form.defaultMedia = this.form.medias[0];
      else this.form.defaultMedia = null;
    },
    step() {
      if (this.step === 1) {
        if (this.$refs.picture) this.$refs.picture.newAborter();
      }
    }
  },

  methods: {
    cancel() {
      if (this.$refs.picture) this.$refs.picture.abort();
      this.$emit("cancel");
    },

    submit() {
      this.$emit("submit");
    },
    reset() {
      this.form.defaultMedia = null;
      this.form.medias = [];
    }
  },

  apollo: {
    announcementCreateCategoryGet: {
      fetchPolicy: "network-only",
      query: gql`
        query announcementCreateCategoryGet($id: ID!) {
          announcementCreateCategoryGet(id: $id) {
            id
          }
        }
      `,
      skip() {
        return this.form.category === null;
      },
      variables() {
        return {
          id: this.form.category.id
        };
      },
      result({ data }) {
        if (data.announcementCreateCategoryGet === null) {
          this.canContinue = false;
        } else {
          this.canContinue = true;
        }
      }
    }
  }
};
</script>

<style></style>
