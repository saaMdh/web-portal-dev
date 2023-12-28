<template>
  <v-card
    class="v-picture mb-5"
    :class="{ 'v-picture--hover': hover, 'v-picture--error': error }"
    :loading="loading > 0"
    variant="outlined"
    elevation="0"
    @click="$refs.file.click()"
  >
    <div ref="dz">
      <div v-if="previewData.length == 0" class="__msg">
        <h3 class="title">{{ t("title") }}</h3>
        <span class="subtitle">{{ t("subtitle") }}</span>
      </div>

      <div v-if="previewData.length > 0" class="__preview mt-n3">
        <v-row>
          <v-col
            v-for="(src, index) in previewData"
            :key="index"
            class="pb-0"
            md="auto"
          >
            <v-img
              v-ripple
              :src="previewData[index].mediaUrl"
              height="100"
              width="160"
              cover
              class="v-picture-item mt-3"
              @click.stop="$emit('select', src)"
            >
              <div
                v-if="!isUploaded(src) && !loading"
                class="v-picture-item__caption"
              >
                <div>
                  <div class="text-caption line-height-1">
                    {{ t("deleteAndTry") }}
                  </div>

                  <v-btn
                    :aria-label="$t('_.close')"
                    class="pa-0"
                    variant="text"
                    dark
                    size="small"
                    @click.stop="remove(src)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-img>
          </v-col>
        </v-row>
      </div>

      <v-card-actions class="justify-space-between">
        <v-btn
          :aria-label="$t('_.delete')"
          size="large"
          icon
          dark
          color="red"
          @click.stop="removeAll"
        >
          <v-icon dark>mdi-delete</v-icon>
        </v-btn>

        <v-btn
          :aria-label="$t('_.upload')"
          size="large"
          icon
          @click.stop="$refs.file.click()"
        >
          <v-icon dark>mdi-camera</v-icon>
        </v-btn>
      </v-card-actions>
    </div>

    <input
      ref="file"
      type="file"
      multiple
      class="d-none"
      @change="updateImage($refs.file.files)"
    />

    <v-alert v-for="item in errorMessages" :key="item" type="error">
      {{ item }}
    </v-alert>
  </v-card>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";
import isArray from "lodash/isArray";
import map from "lodash/map";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import env from "@/utils/env.js";
import { useI18n } from "vue-i18n";

const options = {
  maxSizeMB: 3,
  maxWidthOrHeight: 1920
};

export default {
  mixins: [MessageBox],

  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const { token } = useAuthFrame();

    const { t } = useI18n({
      messages: {
        fr: {
          title: "Choisir une image",
          subtitle:
            "Sélectionner ou glisser-déplacer l'image depuis votre ordinateur",
          loading: "Chargement...",
          deleteAndTry: "Supprimer et réessayer"
        },
        ar: {
          title: "اختيار صورة",
          subtitle: "اختر أو قم بجلب صورة من جهازك",
          loading: "تحميل ...",
          deleteAndTry: "قم بالحذف وأعد التجربة"
        },
        en: {
          title: "Select photo",
          subtitle: "Choose or drag-and-drop a photo from your device",
          loading: "Loading...",
          deleteAndTry: "Delete and retry"
        }
      }
    });
    return { token, t };
  },

  data() {
    return {
      loading: 0,
      previewData: [],
      linksData: this.modelValue,
      hover: false
    };
  },

  watch: {
    modelValue(v) {
      this.previewData = v;
      this.linksData = v;
    }
  },

  mounted() {
    this.abortCtrl = null;

    this.$refs.dz.addEventListener("dragenter", this.handleDND(true));
    this.$refs.dz.addEventListener("dragover", this.handleDND(true));
    this.$refs.dz.addEventListener("dragleave", this.handleDND(false));
    this.$refs.dz.addEventListener("dragend", this.handleDND(false));

    this.$refs.dz.addEventListener("drop", this.preventDefault);
  },

  beforeUnmount() {
    this.abort();
  },

  deactivated() {
    this.abort();
  },

  methods: {
    async readFiles(files) {
      return Promise.all(
        map(files, f => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(f);
          });
        })
      );
    },

    async updateImage(files) {
      this.loading++;

      const previewsList = await this.readFiles(files);
      this.previewData = [...this.previewData, ...previewsList];
      const imageCompression = (await import("browser-image-compression"))
        .default;

      const queries = map(files, async f => {
        const ff = await imageCompression(f, options);
        const form = new FormData();
        form.append("image", ff, ff.name);

        try {
          this.abortCtrl = new AbortController();

          const results = await fetch(env.VUE_APP_STORAGE_URL, {
            method: "POST",
            body: form,
            headers: {
              Authorization: `Bearer ${this.token}`
            },
            signal: this.abortCtrl.signal
          }).then(r => r.json());

          if (isArray(results)) {
            this.linksData = [
              ...this.linksData,
              ...map(results, r => ({
                mediaUrl: r.link,
                mimeType: r.mimetype
              }))
            ];
          } else {
            this.linksData.push({
              mediaUrl: results.link,
              mimeType: results.mimeType
            });
          }
        } catch (error) {
          await this.$alert({
            title: this.$t("@.error.0"),
            message: this.$t("@.error.1")
          });
        }
      });

      await Promise.all(queries);

      this.$emit("update:modelValue", this.linksData);
      this.loading--;

      this.$refs.file.value = "";
    },

    removeAll() {
      this.abort();
      this.$refs.file.value = "";
      this.linksData = [];
      this.previewData = [];
      this.$emit("update:modelValue", []);
    },
    remove(src) {
      const index = this.previewData.findIndex(element => element == src);
      if (index >= 0) this.previewData.splice(index, 1);

      const linkIndex = this.linksData.findIndex(element => element == src);
      if (linkIndex >= 0) {
        this.linksData.splice(linkIndex, 1);
        this.$emit("update:modelValue", this.linksData);
      }
    },

    abort() {
      this.$refs.dz.removeEventListener("dragenter", this.handleDND(true));
      this.$refs.dz.removeEventListener("dragover", this.handleDND(true));
      this.$refs.dz.removeEventListener("dragleave", this.handleDND(false));
      this.$refs.dz.removeEventListener("dragend", this.handleDND(false));
      this.$refs.dz.removeEventListener("drop", this.preventDefault);
      if (this.abortCtrl) this.abortCtrl.abort();
    },

    updateImageListner(e) {
      e.preventDefault();
      this.hover = false;
      this.updateImage(e.dataTransfer.files);
    },

    handleDND(v) {
      return e => {
        e.preventDefault();
        this.hover = v;
      };
    },

    isUploaded(src) {
      return this.linksData.includes(src);
    }
  }
};
</script>

<style lang="scss">
.v-card.v-sheet.v-picture {
  &.v-card--link:before {
    content: none;
  }

  position: relative;
  cursor: pointer;
  transition: background 200ms ease-in-out;
  min-height: 100px;

  &:hover,
  &.v-picture--hover {
    border-color: rgb(var(--v-theme-primary));
  }

  &.v-picture--error {
    border-color: rgb(var(--v-theme-error));
    background: #ffeeee;
  }

  .__msg {
    text-align: center;
    padding: 4rem;
  }

  .__preview {
    padding: 8px;

    .v-image {
      border: 1px solid rgb(var(--v-border-color));
      border-radius: 8px;
      overflow: hidden;
    }
  }
}

.v-picture-item {
  &__caption {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;

    display: flex;
    align-items: flex-end;
    padding: 4px * 2;

    background: rgba(#9a0007, 0.75);
    color: white;

    > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>
