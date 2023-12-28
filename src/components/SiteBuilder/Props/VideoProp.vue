<template>
  <div class="s-video-prop">
    <v-card width="128" height="128" @click.stop="$refs.inputfile.click()">
      <template #loader>
        <v-progress-linear
          v-if="loading"
          :model-value="
            (dataWrapper.uploadProgress + dataWrapper.processingProgress) / 2
          "
        ></v-progress-linear>
      </template>
      <div class="d-flex justify-center align-center full-h">
        <ok-video v-if="mediaPreview" :media="mediaPreview" cover />
        <v-icon v-else size="x-large">mdi-cloud-upload</v-icon>
      </div>
    </v-card>

    <div class="d-flex flex-column align-start flex-gap-2 pa-2">
      <v-btn
        variant="text"
        size="x-small"
        color="error"
        :disabled="!modelValue || !(modelValue && modelValue.length)"
        @click="remove()"
      >
        <v-icon start>mdi-delete</v-icon>
        {{ $t("_.remove") }}
      </v-btn>
      <v-btn
        v-if="error"
        variant="text"
        size="x-small"
        color="warning"
        @click="reUploadVideo()"
      >
        <v-icon start>mdi-refresh</v-icon>
        {{ $t("_.REFRESH") }}
      </v-btn>
      <input
        ref="inputfile"
        type="file"
        accept="video/*"
        class="d-none"
        @change="uploadVideo($refs.inputfile.files)"
      />
    </div>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import { uploadImageToCDN } from "@ouedkniss/web-ui-plugin/src/utils/cdn/FileUploaderField/FileUploaderUtils";
import OkVideo from "@ouedkniss/web-ui-plugin/src/components/video/OkVideo.vue";
import { reactive, ref, computed } from "vue";
import get from "lodash/get";

export default {
  components: {
    OkVideo
  },
  props: {
    modelValue: {
      type: [Array, String],
      default: ""
    },
    label: {
      type: String,
      default: null
    }
  },

  setup(props, { emit }) {
    const { token } = useAuthFrame();
    const loading = ref(0);
    const error = ref(false);
    const inputfile = ref(null);
    const cachedFiles = reactive([]);

    let dataWrapper = reactive({
      file: null,
      mediaUrl: "",
      mimeType: "",
      size: "",
      uploadProgress: 1,
      processingProgress: 1,
      abortCtrl: new AbortController(),
      hasError: false,
      code: 0
    });

    function uploadVideo(files) {
      upload(files[0]);
    }
    function reUploadVideo() {
      if (cachedFiles.length === 0) return;
      upload(cachedFiles[0]);
    }

    async function upload(file) {
      loading.value++;
      try {
        error.value = false;
        dataWrapper = createWrapper(file);
        const option = {
          token: token.value,
          dataWrapper: createWrapper(file),
          uploadType: "video",
          index: 0
        };
        const data = await uploadImageToCDN(option);
        if (data.error) throw new Error("file type not allowed", 1);

        emit("update:modelValue", [
          {
            mediaType: get(data, "mediaType", data.mimeType),
            thumbnail: get(data, "thumbnail", data.thumbnailUrl),
            mediaUrl: get(data, "mediaUrl", data.link)
          }
        ]);
        error.value = false;
      } catch (e) {
        error.value = true;
        console.error(e);
      }
      inputfile.value.value = "";
      loading.value--;
    }

    const mediaPreview = computed(() => {
      if (dataWrapper.mediaUrl) return { mediaUrl: dataWrapper.mediaUrl };
      if (props.modelValue[0]) return props.modelValue[0];
      return null;
    });

    function resetWrapper() {
      dataWrapper.file = null;
      dataWrapper.mediaUrl = "";
      dataWrapper.mimeType = "";
      dataWrapper.size = "";
      dataWrapper.uploadProgress = 1;
      dataWrapper.processingProgress = 1;
      dataWrapper.abortCtrl = new AbortController();
      dataWrapper.hasError = false;
      dataWrapper.code = 0;
    }

    function createWrapper(file) {
      cachedFiles.unshift(file);
      dataWrapper.file = file;
      dataWrapper.mediaUrl = URL.createObjectURL(file);
      dataWrapper.mimeType = file.type;
      dataWrapper.size = file.size;
      dataWrapper.uploadProgress = 1;
      dataWrapper.processingProgress = 1;
      dataWrapper.abortCtrl = new AbortController();
      dataWrapper.hasError = false;
      dataWrapper.code = 0;
      return dataWrapper;
    }

    return {
      dataWrapper,
      cachedFiles,
      inputfile,
      loading,
      error,
      token,
      mediaPreview,
      resetWrapper,
      uploadVideo,
      reUploadVideo
    };
  },

  watch: {
    modelValue(v) {
      if (!v) {
        this.abort();
        this.inputfile.value = "";
      }
    }
  },

  beforeUnmount() {
    this.abort();
    this.cachedFiles.forEach(file => {
      URL.revokeObjectURL(file);
    });
  },

  deactivated() {
    this.abort();
  },

  methods: {
    remove() {
      this.resetWrapper();
      this.$emit("update:modelValue", []);
      this.inputfile.value = "";
    },
    abort() {
      this.dataWrapper.abortCtrl.abort();
    }
  }
};
</script>

<style lang="scss">
.s-video-prop {
  width: 100%;
  display: flex;
  gap: 4px;
}
</style>
