<template>
  <div>
    <v-dialog
      v-if="$isDesktop"
      v-model="active"
      class="o-publish-dialog"
      width="400"
      hide-overlay
      scrollable
      persistent
      transition="none"
    >
      <v-card tile variant="outlined" class="o-publish">
        <template v-if="isRoleGranted('ANNOUNCER')">
          <v-window v-model="step" eager touchless>
            <v-window-item eager>
              <publish-dialog-category
                ref="category"
                :activated="active"
                @cancel="close"
                @resetForm="resetForm"
                @submit="mergeCategory"
              ></publish-dialog-category>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-picture
                ref="picture"
                :step="step"
                @cancel="step--"
                @submit="mergePicture"
              ></publish-dialog-picture>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-form
                ref="form"
                :form="form"
                @cancel="step--"
                @submit="mergeForm"
              ></publish-dialog-form>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-submit></publish-dialog-submit>
            </v-window-item>
          </v-window>
        </template>

        <template v-else>
          <v-toolbar flat class="o-publish__toolbar">
            <v-spacer></v-spacer>

            <v-btn :aria-label="$t('_.close')" icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <div
            :class="
              $isMobile
                ? 'o-publish__content pt-15 mt-15 full-h'
                : 'o-publish__content'
            "
          >
            <data-placeholder
              class="px-8"
              icon="mdi-account-cancel"
              :scale="0.5"
            >
              {{ $t("publish.notGranted") }}
            </data-placeholder>
            <validate-account-btn
              class="d-flex justify-center align-center pb-3"
            ></validate-account-btn>
          </div>
        </template>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-else
      v-model="active"
      fixed
      temporary
      width="100%"
      touchless
    >
      <v-card tile variant="outlined" class="o-publish">
        <template v-if="isRoleGranted('ANNOUNCER')">
          <v-window v-model="step" eager touchless>
            <v-window-item eager>
              <publish-dialog-category
                ref="category"
                @cancel="close"
                @resetForm="resetForm"
                @submit="mergeCategory"
              ></publish-dialog-category>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-picture
                ref="picture"
                :step="step"
                @cancel="step--"
                @submit="mergePicture"
              ></publish-dialog-picture>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-form
                ref="form"
                :form="form"
                @cancel="step--"
                @submit="mergeForm"
              ></publish-dialog-form>
            </v-window-item>
            <v-window-item eager>
              <publish-dialog-submit></publish-dialog-submit>
            </v-window-item>
          </v-window>
        </template>

        <template v-else>
          <v-toolbar flat class="o-publish__toolbar">
            <v-spacer></v-spacer>

            <v-btn :aria-label="$t('_.close')" icon @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <div
            :class="
              $isMobile
                ? 'o-publish__content pt-15 mt-15 full-h'
                : 'o-publish__content'
            "
          >
            <data-placeholder
              class="px-8"
              icon="mdi-account-cancel"
              :scale="0.5"
            >
              {{ $t("publish.notGranted") }}
            </data-placeholder>
            <validate-account-btn
              class="d-flex justify-center align-center pb-3"
            ></validate-account-btn>
          </div>
        </template>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import merge from "lodash/merge";
import pick from "lodash/pick";

import MessageBox from "@/mixins/MessageBox";

import PublishDialogSubmit from "./PublishDialog/PublishDialogSubmit.vue";
import PublishDialogCategory from "./PublishDialog/PublishDialogCategory.vue";
import PublishDialogPicture from "./PublishDialog/PublishDialogPicture.vue";
import PublishDialogForm from "./PublishDialog/PublishDialogForm.vue";

import Queries from "./PublishDialog/Queries.graphql";

import PublishStore, { FormDefault } from "./PublishDialog/PublishStore";
import ValidateAccountBtn from "@ouedkniss/web-ui-plugin/src/components/Alert/ValidateAccountBtn.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

export default {

  components: {
    PublishDialogForm,
    PublishDialogPicture,
    PublishDialogCategory,
    PublishDialogSubmit,
    ValidateAccountBtn
  },
  mixins: [MessageBox],

  setup() {
    const {
      user,
      token,
      tokenExpires,
      tokenAt,
      makeRefreshToken
    } = useAuthFrame();

    return {
      user,
      token,
      tokenExpires,
      tokenAt,
      makeRefreshToken
    };
  },

  data() {
    return {
      active: false,
      step: 0,
      form: PublishStore,
      firstLoading: true
    };
  },

  watch: {
    "user.isValidated": {
      async handler() {
        if (this.firstLoading) {
          this.firstLoading = false;
          return;
        }
        if (this.user && this.user.isValidated) {
          this.makeRefreshToken();
        }
      }
    }
  },

  methods: {
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.specsModel = {};
        this.$refs.form.$apollo.queries.userPhoneGet.refetch();
      }
    },
    mergeCategory() {
      this.step++;
    },
    mergePicture() {
      this.step++;
    },
    mergeForm() {
      this.step++;

      this.submit();
    },
    async submit() {
      try {
        const announcement = pick(this.form, [
          "title",
          "price",
          "medias",
          "defaultMedia",
          "priceType",
          "specifications",
          "phoneIds",
          "priceUnit",
          "duration",
          "cityIds",
          "regionIds"
        ]);

        announcement.categoryId = this.form.category.id;

        await this.$apollo.mutate({
          mutation: Queries.Submit,
          variables: { announcement }
        });

        await this.$alert({
          icon: "mdi-checkbox-marked-circle-outline",
          iconColor: "green",
          title: this.$t("announcement.alerts.submit.title"),
          message: this.$t("announcement.alerts.submit.message")
        });

        this.$nextTick(() => this.close());
      } catch (error) {
        await this.$alert({
          title: this.$t("@.error.0"),
          message: this.$t("@.error.1")
        });

        this.step--;
      }
    },
    reset() {
      merge(this.form, FormDefault);

      this.step = 0;

      if (this.$refs.category) this.$refs.category.reset();
      if (this.$refs.picture) this.$refs.picture.reset();
      if (this.$refs.form) this.$refs.form.resetForm();
    },
    open() {
      this.reset();
      this.active = true;
    },
    close() {
      this.active = false;
      if (this.$refs.category) this.$refs.category.closeCategories();
      this.reset();
    }
  }
};
</script>

<style lang="scss"></style>
