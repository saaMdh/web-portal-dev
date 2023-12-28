<template>
  <div class="pa-2">
    <p>{{ $t("components.queryProp.noData") }}</p>
    <v-btn color="primary" size="small" @click="changeEditorTab('queries')">{{
      $t("components.queryProp.addQuery")
    }}</v-btn>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {};
  },

  methods: {
    ...mapMutations({ changeEditorTab: "builder/changeEditorTab" })
  }
};
</script>

<style></style>
