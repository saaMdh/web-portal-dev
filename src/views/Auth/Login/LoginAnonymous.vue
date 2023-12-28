<template>
  <data-placeholder
    icon="mdi-account-multiple-outline"
    :scale="0.6"
    class="mx-2"
    color="secondary"
  >
    <template #actions>
      <div v-if="nbClick > 0" class="d-flex justify-center align-center mb-4">
        <vue-recaptcha
          ref="recaptcha"
          :key="cacheRecaptcha"
          :model-value="recaptchaToken"
          :theme="darkMode ? 'dark' : 'light'"
          @update:modelValue="onVerify"
        >
        </vue-recaptcha>
      </div>

      <v-btn
        rounded
        depressed
        block
        color="secondary"
        :disabled="!isHuman && nbClick == 1"
        @click="loginAnonymous"
      >
        {{ $t("login.anonymousContinue") }}
      </v-btn>
    </template>
  </data-placeholder>
</template>

<script>
import DataPlaceholder from "@/components/Content/DataPlaceholder";
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import env from "@/utils/env.js";

export default {
  components: { VueRecaptcha, DataPlaceholder },
  props: {
    chunk: {
      type: String,
      default: null
    }
  },

  setup() {
    const { darkMode } = useAuthFrame();
    useRecaptchaProvider();
    return {
      darkMode
    };
  },

  data() {
    return {
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,
      isHuman: false,
      recaptchaToken: null,
      nbClick: 0,
      cacheRecaptcha: 0
    };
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
      this.loginAnonymous();
    },

    loginAnonymous() {
      if (this.nbClick === 0) this.nbClick++;

      if (!this.isHuman) return;
      if (!isUndefined(this.$route.query.redirectTo)) {
        this.$router.push({
          name: "login",
          query: {
            redirectTo: this.$route.query.redirectTo,
            loginAnonymous: true,
            recaptchaToken: this.recaptchaToken
          }
        });
      } else if (!isEmpty(this.$route.query)) {
        this.$router.push({
          name: "login",
          query: {
            ...this.$route.query,
            loginAnonymous: true,
            recaptchaToken: this.recaptchaToken
          }
        });
      }
    }
  }
};
</script>

<style></style>
