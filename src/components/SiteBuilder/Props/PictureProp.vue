<template>
  <div class="s-picture-prop">
    <v-card
      width="64"
      height="64"
      :loading="loading > 0"
      @click.stop="$refs.file.click()"
    >
      <div class="d-flex justify-center align-center full-h">
        <v-img
          v-if="valueObject"
          :src="valueObject.full"
          :aspect-ratio="1"
        ></v-img>
        <v-icon v-else color="grey" size="large">mdi-image-plus</v-icon>
      </div>
    </v-card>

    <div class="d-flex flex-column align-start flex-gap-2 pa-2">
      <v-btn text size="x-small" @click="dialog.active = true">
        <v-icon start>mdi-camera</v-icon>
        {{ $t("props.picturProp.search") }}
      </v-btn>

      <v-btn
        variant="text"
        size="x-small"
        color="error"
        :disabled="!modelValue"
        @click="$emit('update:modelValue', null)"
      >
        <v-icon start>mdi-delete</v-icon>
        {{ $t("_.remove") }}
      </v-btn>

      <input
        ref="file"
        type="file"
        accept="image/*"
        class="d-none"
        @change="updateImage($refs.file.files)"
      />
    </div>

    <unsplash-search-dialog
      v-model="dialog.active"
      @select="v => $emit('update:modelValue', v)"
    ></unsplash-search-dialog>
  </div>
</template>

<script>
import UnsplashSearchDialog from "@/components/SiteBuilder/Dialog/UnsplashSearchDialog.vue";
import env from "@/utils/env.js";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import isPlainObject from "lodash/isPlainObject";
import map from "lodash/map";
import isString from "lodash/isString";

export default {
  components: { UnsplashSearchDialog },
  props: {
    modelValue: {
      type: [String, Object],
      default: ""
    },
    label: {
      type: String,
      default: null
    }
  },

  setup() {
    const { token } = useAuthFrame();
    return { token };
  },

  data() {
    return {
      loading: 0,
      dialog: {
        active: false
      }
    };
  },

  computed: {
    valueObject() {
      if (!this.modelValue) return null;

      if (isPlainObject(this.modelValue)) return this.modelValue;

      return {
        full: this.modelValue,
        thumb: this.modelValue
      };
    }
  },

  watch: {
    modelValue(v) {
      if (!v) {
        this.abort();
        this.$refs.file.value = "";
      }
    }
  },

  mounted() {
    this.abortCtrl = new AbortController();
  },

  beforeUnmount() {
    this.abort();
  },

  deactivated() {
    this.abort();
  },

  methods: {
    async IsSvg(data) {
      if (isString(data)) {
        let url = data;
        const r = await fetch(url, { method: "HEAD" });
        return r.headers.get("content-type") === "image/svg+xml";
      } else return data.type.includes("svg");
    },
    abort() {
      this.abortCtrl.abort();
    },

    async updateImage(files) {
      this.loading++;

      const form = new FormData();

      const compressOpts = {
        maxSizeMB: 3,
        maxWidthOrHeight: 1600
      };
      const imageCompression = (await import("browser-image-compression"))
        .default;

      await Promise.all(
        map(files, async f => {
          if (!this.IsSvg(f)) f = await imageCompression(f, compressOpts);
          form.append("image", f, f.name);
        })
      );

      try {
        const uploadUrl = new URL(env.VUE_APP_UPLOAD);
        uploadUrl.pathname = "upload/image";
        const results = await fetch(uploadUrl.href, {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Bearer ${this.token}`
          }
          // signal: this.abortCtrl.signal
        }).then(r => {
          if (r.status != 200) throw new Error("File upload failed");
          return r.json();
        });

        const v = {
          full: results.link,
          thumb: results.link
        };

        this.$emit("update:modelValue", v);
      } catch (error) {
        console.error(error);
      }

      this.$refs.file.value = "";
      this.loading--;
    }
  }
};
</script>

<style lang="scss">
.s-picture-prop {
  width: 100%;
  display: flex;
  gap: 4px;
}
</style>
