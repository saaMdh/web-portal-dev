<template>
  <form class="s-okaptcha" @submit.prevent>
    <v-text-field
      v-model="resolve"
      filled
      rounded
      :error-messages="errorMessage"
      class="__text"
      :label="$t('components.contactBlock.code')"
    ></v-text-field>
    <img
      :src="response.image"
      :max-height="height"
      :max-width="width"
      class="__img"
    />
  </form>
</template>

<script>
import env from "@/utils/env.js";
import BuildUrl from "build-url";
import merge from "lodash/merge";
export default {
  props: {
    modelValue: {
      type: Object,
      default: () => {}
    },
    errorMessage: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 245
    },
    height: {
      type: Number,
      default: 50
    },
    darkmode: {
      type: Boolean,
      default: false
    },
    reload: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    response: {
      image: null,
      hash: null,
      expires_at: null
    },
    error: false
  }),
  computed: {
    resolve: {
      get() {
        return (this.modelValue && this.modelValue.resolve) || "";
      },
      set(v) {
        if (!v) this.$emit("update:modelValue", null);
        else
          this.$emit("update:modelValue", {
            resolve: v,
            hash: this.response.hash
          });
      }
    }
  },
  watch: {
    reload(curr, prev) {
      this.reset();
      if (curr > prev) this.generate();
    }
  },
  created() {
    this.generate();
  },
  methods: {
    generate() {
      const endpointOkaptcha = env.VUE_APP_OKAPTCHA_API;
      const endpoint = env.VUE_APP_GRAPHQL_HTTP.replace(
        "/graphql",
        endpointOkaptcha
      );
      const url = BuildUrl(endpoint, {
        queryParams: {
          width: this.width,
          height: this.height,
          darkmode: this.darkmode
        }
      });
      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.response = merge(this.response, res);
        })
        .catch(async () => {
          this.error = true;
          await this.$alert({
            title: this.$t("@.error.0"),
            message: this.$t("@.error.1")
          });
        });
    },
    reset() {
      this.response = {
        image: null,
        hash: null,
        expires_at: null
      };
      this.resolve = null;
    }
  }
};
</script>

<style lang="scss">
.s-okaptcha {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  margin: 1px;
  .__img,
  .__text {
    margin: 5px;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    margin: 0%;
    padding: 0%;
  }
}
</style>
