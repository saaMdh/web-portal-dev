<template>
  <v-dialog v-model="active" dark persistent max-width="500px">
    <v-card>
      <v-card-title v-if="form.index !== null">
        {{ $t("components.editorPagesDialog.title.edit") }}
      </v-card-title>
      <v-card-title v-else>
        {{ $t("components.editorPagesDialog.title.add") }}
      </v-card-title>

      <v-card-text>
        <template v-for="lang in langs" :key="lang">
          <v-text-field
            v-model="form.title[lang]"
            :label="$t(`components.editorPagesDialog.pageTitle.${lang}`)"
            filled
            autofocus
          ></v-text-field>
        </template>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text size="small" @click="active = false">
          {{ $t("_.cancel") }}
        </v-btn>
        <v-btn color="primary" text size="small" @click="submit">
          {{ $t("_.validate") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

const PageDialogData = {
  index: null,
  title: {
    fr: "",
    ar: "",
    en: ""
  }
};

export default {
  data() {
    return {
      active: false,

      form: {
        ...PageDialogData
      },
      langs: ["fr", "ar", "en"]
    };
  },

  methods: {
    open(obj) {
      this.form = cloneDeep(PageDialogData);

      if (obj) {
        const { page, index } = obj;
        this.form.index = index;
        this.form.title = page.title;
      }

      this.active = true;
    },

    submit() {
      this.$emit("submit", this.form);
      this.active = false;
    }
  }
};
</script>

<style></style>
