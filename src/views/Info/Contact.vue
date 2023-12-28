<template>
  <v-container class="o-article">
    <section-heading
      icon="mdi-android-messages"
      icon-color="primary"
      class="mb-3"
      tag="h1"
    >
      <template #title>
        {{ $t("contact.title") }}
      </template>
    </section-heading>

    <p>
      {{ $t("contact.text.0") }}
    </p>
    <p class="py-4">
      {{ $t("contact.text.1") }}
    </p>
    <p>
      <strong>
        <v-icon>mdi-map-marker</v-icon>
        {{ $t("contact.info.adresse.0") }} : </strong
      ><br v-if="$isMobile" />
      {{ $t("contact.info.adresse.1") }}
      <br />
      <strong>
        <v-icon>mdi-email</v-icon> {{ $t("contact.info.email.0") }} : </strong
      ><br v-if="$isMobile" />
      contact@ouedkniss.com
    </p>

    <v-row class="mt-4">
      <v-col cols="12" md="6" order="2" order-md="1">
        <v-card class="rounded-lg" variant="elevated" elevation="1">
          <vv-form ref="form" v-slot="{ meta }" @submit="submit">
            <v-card-title>{{ $t("contact.form.title") }}</v-card-title>
            <v-card-text class="mt-2">
              <vv-field
                v-slot="{ field, errors }"
                name="email"
                rules="email|max:200"
              >
                <v-text-field
                  v-bind="field"
                  v-model="contactForm.email"
                  variant="outlined"
                  :label="$t('contact.form.email') + '*'"
                  name="email"
                  :error-messages="errors"
                ></v-text-field>
              </vv-field>
              <vv-field
                v-slot="{ field, errors }"
                name="name"
                rules="required|max:200"
              >
                <v-text-field
                  v-bind="field"
                  v-model="contactForm.name"
                  variant="outlined"
                  :label="$t('contact.form.name') + '*'"
                  name="name"
                  :error-messages="errors"
                ></v-text-field>
              </vv-field>

              <vv-field
                v-slot="{ field, errors }"
                name="phone"
                rules="phone|validatePhone"
              >
                <v-text-field
                  v-bind="field"
                  v-model="contactForm.phone"
                  variant="outlined"
                  :label="$t('contact.form.phone') + '*'"
                  :error-messages="errors"
                ></v-text-field>
              </vv-field>

              <vv-field v-slot="{ field }" name="tag" rules="required">
                <v-select
                  v-bind="field"
                  v-model="contactForm.tag"
                  variant="outlined"
                  :items="list"
                  :label="$t('contact.form.object') + '*'"
                ></v-select>
              </vv-field>

              <vv-field
                v-slot="{ field, errors }"
                name="message"
                rules="required|min:5|max:2000"
              >
                <v-textarea
                  v-bind="field"
                  v-model="contactForm.content"
                  variant="outlined"
                  :label="$t('contact.form.message') + '*'"
                  :error-messages="errors"
                ></v-textarea>
              </vv-field>

              <vue-recaptcha
                :key="cacheRecaptcha"
                ref="recaptchaContact"
                :model-value="recaptchaToken"
                :theme="darkMode ? 'dark' : 'light'"
                @update:modelValue="onVerify"
              >
              </vue-recaptcha>
              <v-spacer></v-spacer>
            </v-card-text>
            <v-card-actions
              ><v-spacer></v-spacer
              ><v-btn
                :aria-label="$t('contact.form.submit')"
                color="primary"
                type="submit"
                variant="elevated"
                rounded
                :loading="loading > 0"
                :disabled="!isHuman || !meta.valid"
                >{{ $t("contact.form.submit") }}
              </v-btn></v-card-actions
            >
          </vv-form>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" order="1" order-md="2">
        <v-card variant="elevated" elevation="1">
          <iframe
            class="d-block"
            title="ad contact"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3802.9211985319134!2d3.096748964652215!3d36.725856103780536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sdz!4v1554041417161!5m2!1sfr!2sdz"
            width="100%"
            :height="$isDesktop ? '500' : '400'"
            frameborder="0"
            style="border: 0"
            allowfullscreen
          ></iframe>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";
import MessageBox from "@/mixins/MessageBox";
import SectionHeading from "@/components/Content/SectionHeading.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import env from "@/utils/env.js";

export default {
  components: {
    VueRecaptcha,
    SectionHeading
  },
  mixins: [MessageBox],

  setup() {
    const { darkMode, token } = useAuthFrame();
    useRecaptchaProvider();
    return {
      darkMode,
      token
    };
  },

  data() {
    return {
      loading: 0,
      contactForm: {
        email: "",
        name: "",
        phone: null,
        content: "",
        tag: []
      },
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,
      isHuman: false,
      recaptchaToken: null,
      cacheRecaptcha: 0
    };
  },
  computed: {
    list() {
      return ["BUG", "SUGGESTION", "PUBLICITY_PARTNERSHIP", "OTHER"].map(v => ({
        title: this.$t(`contact.contact.Tag.${v}`),
        value: v
      }));
    }
  },

  watch: {
    darkMode() {
      this.cacheRecaptcha++;
    }
  },

  methods: {
    onVerify(response) {
      if (!response) return;

      this.isHuman = true;

      this.recaptchaToken = response;
    },

    async submit() {
      if (!this.isHuman) return;

      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;
      this.loading++;

      try {
        let headers = {
          "Content-Type": "application/json",
          "recaptcha-Token": `${this.recaptchaToken}`
        };

        if (this.token) {
          headers.Authorization = `Bearer ${this.token}`;
        }

        await fetch(env.VUE_APP_GRAPHQL_HTTP, {
          method: "POST",
          body: JSON.stringify({
            variables: {
              request: {
                email: this.contactForm.email
                  ? this.contactForm.email
                  : undefined,
                name: this.contactForm.name,
                phone: this.contactForm.phone
                  ? this.contactForm.phone
                  : undefined,
                content: this.contactForm.content,
                tag:
                  this.contactForm.tag.length > 0
                    ? this.contactForm.tag
                    : undefined
              }
            },
            query:
              "mutation($request: ContactInput!) { createContact(contactInput: $request)}"
          }),

          headers: headers
        });

        await this.$alert({
          title: this.$t("contact.success.0"),
          message: this.$t("contact.success.1"),
          icon: "mdi-email",
          iconColor: "green"
        });

        this.$router.push({ name: "home" });
      } catch (error) {
        this.isHuman = false;
        this.recaptchaToken = null;
        await this.$alert({
          title: this.$t("@.error.0"),
          message: this.$t("@.error.1")
        });
      }

      this.loading--;
    }
  }
};
</script>

<style lang="scss"></style>
