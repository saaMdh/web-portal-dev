<template>
  <v-container fluid>
    <v-card class="px-6 py-4" elevation="1">
      <vv-form
        ref="form"
        v-slot="{ meta }"
        class="s-contact-block"
        @submit="submit"
      >
        <h1 class="s-contact-block__title mb-6 mt-2">
          {{ $t("components.contactBlock.title") }}
        </h1>
        <div v-if="!user">
          <vv-field
            v-slot="{ errors, field }"
            name="name"
            rules="required|min:3|max:255"
          >
            <v-text-field
              v-bind="field"
              v-model="contactForm.name"
              variant="solo-filled"
              flat
              rounded
              :error-messages="errors"
              :label="$t('components.contactBlock.fields.name')"
            ></v-text-field>
          </vv-field>
          <vv-field v-slot="{ errors, field }" name="email" rules="email">
            <v-text-field
              v-bind="field"
              v-model="contactForm.email"
              variant="solo-filled"
              flat
              rounded
              :error-messages="errors"
              :label="$t('components.contactBlock.fields.email')"
            ></v-text-field>
          </vv-field>
        </div>
        <vv-field
          v-slot="{ errors, field }"
          v-model="contactForm.message"
          name="message"
          rules="required|min:3|max:1000"
        >
          <v-textarea
            v-bind="field"
            :model-value="contactForm.message"
            variant="solo-filled"
            flat
            rounded="xl"
            :error-messages="errors"
            :label="$t('components.contactBlock.fields.message')"
          ></v-textarea>
        </vv-field>
        <div
          :class="
            $isMobile
              ? 'd-flex flex-column align-center'
              : 'd-flex justify-space-between align-center'
          "
        >
          <okaptcha
            v-if="outsider"
            ref="okaptchaContact"
            v-model="okaptcha"
            :error-message="errorOkaptcha"
            :reload="reloadTime"
          ></okaptcha>
          <vue-recaptcha
            v-else
            ref="recaptchaContact"
            :model-value="recaptchaToken"
            :theme="$vuetify.theme.current.dark ? 'dark' : 'light'"
            @update:modelValue="onVerify"
            @verify="onVerify"
          >
          </vue-recaptcha>
          <v-btn
            color="primary"
            variant="elevated"
            rounded
            :disabled="disabled || !meta.valid"
            :loading="loading > 0"
            :class="$isMobile ? 'mt-4' : ''"
            @click="submit"
          >
            {{ $t("components.contactBlock.send") }}
          </v-btn>
        </div>

        <div :class="$isMobile ? 'text-center mt-2' : 'text-right mt-2'"></div>
      </vv-form>
    </v-card>
  </v-container>
</template>

<script>
import Okaptcha from "@/components/Captcha/Okaptcha";
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import BlocksHelperMixin from "@/components/SiteBuilder/Blocks/BlockHelperMixin";
import MessageBox from "@/mixins/MessageBox";

import { mapGetters } from "vuex";
import env from "@/utils/env.js";
import gql from "graphql-tag";

export default {
  components: {
    VueRecaptcha,
    Okaptcha
  },
  mixins: [MessageBox, BlocksHelperMixin],

  props: {},

  editableProps: [],
  setup() {
    const { user, scope } = useAuthFrame();
    useRecaptchaProvider();
    return {
      user,
      scope
    };
  },

  data() {
    return {
      loading: 0,
      contactForm: {
        email: "",
        name: "",
        message: "",
        store_id: ""
      },
      okaptcha: null,
      errorOkaptcha: null,
      reloadTime: 0,
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,
      isHuman: false,
      recaptchaToken: null
    };
  },
  computed: {
    ...mapGetters({ store: "builder/store" }),
    disabled() {
      return this.outsider ? this.okaptcha == null : !this.isHuman;
    },
    outsider() {
      const url = new URL(env.VUE_APP_OUEDKNISS_PORTAL);
      return location.hostname !== url.hostname;
    },
    headers() {
      return this.outsider
        ? {
            "x-okaptcha-hash": this.okaptcha && this.okaptcha.hash,
            "x-okaptcha-resolve": this.okaptcha && this.okaptcha.resolve
          }
        : { "recaptcha-Token": this.recaptchaToken };
    }
  },
  methods: {
    onVerify(response) {
      if (!response) return;

      this.isHuman = true;

      this.recaptchaToken = response;
    },
    onExpired() {
      this.isHuman = false;
      this.recaptchaToken = null;
    },

    resetForm() {
      this.contactForm = {
        email: "",
        name: "",
        message: "",
        store_id: ""
      };
    },
    submit: async function () {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;
      this.contactForm.store_id = this.store.id;

      this.loading++;

      if (this.user) {
        const receiver = { type: "STORE", id: this.store.id };
        await this.$messenger.chatWith(receiver, {
          storeContactData: {
            message: this.contactForm.message,
            name: this.contactForm.name,
            email: this.contactForm.email,
            phone: null
          }
        });
      } else {
        try {
          const { data } = await this.$apollo.mutate({
            context: {
              headers: this.headers
            },
            mutation: gql`
              mutation ThreadContactStoreCreation(
                $storeId: ID!
                $message: String!
                $name: String!
                $email: String
                $phone: String
              ) {
                ${
                  !this.outsider
                    ? "threadContactStoreCreation"
                    : "threadContactStoreCreationOutsider"
                }(
                  receiverId: $storeId
                  message: $message
                  name: $name
                  email: $email
                  phone: $phone
                )
              }
            `,
            variables: {
              storeId: this.store.id,
              message: this.contactForm.message,
              name: this.contactForm.name,
              email: this.contactForm.email
              // phone: null
            }
          });
          if (
            data.threadContactStoreCreation ||
            data.threadContactStoreCreationOutsider
          ) {
            await this.$alert({
              title: this.$t("alerts.contact.title"),
              message: this.$t("alerts.contact.message"),
              icon: "mdi-email",
              iconColor: "green"
            });
          } else {
            await this.$alert({
              title: this.$t("announcement.@.error.0"),
              message: this.$t("announcement.@.error.1")
            });
          }
        } catch (_) {
          this.isHuman = false;
          this.recaptchaToken = null;
          await this.$alert({
            title: this.$t("announcement.@.error.0"),
            message: this.$t("announcement.@.error.1")
          });
        }
      }
      this.recaptchaToken = null;
      if (this.outsider) this.$refs.okaptchaContact.reset();
      this.loading--;
      this.reloadTime++;
    }
  }
};
</script>

<style lang="scss">
.s-contact-block {
  &__title {
    line-height: 1;
    font-weight: 100;
    white-space: pre-line;
  }
}
</style>
