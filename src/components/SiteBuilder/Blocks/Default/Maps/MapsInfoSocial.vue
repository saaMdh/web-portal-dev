<template>
  <v-list-item :href="social.url" target="blank">
    <template #prepend>
      <social-icon :name="social.name"></social-icon>
    </template>
    <span> {{ removeHttp(social.url) }} </span>
  </v-list-item>
</template>

<script>
import SocialIcon from "@ouedkniss/web-ui-plugin/src/components/Formatting/SocialIcon.vue";

export default {
  components: { SocialIcon },
  props: {
    social: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeHttp(href) {
      let url = new URL(href);
      return url.host + url.pathname;
    }
  }
};
</script>

<style></style>
