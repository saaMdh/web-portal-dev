<template>
  <div ref="wrap" aria-hidden="true" :style="style"></div>
</template>

<script>
import each from "lodash/each";
import endsWith from "lodash/endsWith";
import env from "@/utils/env.js";
import { isJsonString } from "@/utils/String.js";
export default {
  props: {
    promo: {
      type: Object,
      required: true
    },
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loaded: false
    };
  },
  computed: {
    style() {
      return {
        width: endsWith(this.width, "px") ? this.width : `${this.width}px`,
        height: endsWith(this.height, "px") ? this.height : `${this.height}px`
      };
    }
  },
  mounted() {
    window.addEventListener("message", this.messageListener);
    this.runScript();
    setTimeout(() => {
      if (!this.loaded) {
        this.$emit("load");
        this.loaded = true;
      }
    }, 3000);
  },
  beforeUnmount() {
    window.removeEventListener("message", this.messageListener);
  },
  methods: {
    messageListener(event) {
      try {
        if (!isJsonString(event.data)) return;
        if (!this.loaded) {
          this.$emit("load", true);
          this.loaded = true;
        }
        this.loaded = true;
        let message = JSON.parse(event.data);
        if (message.msg_type === "resize-me") {
          let shouldCollapseAd = false;
          for (let index in message.key_value) {
            let key = message.key_value[index].key;
            let value = message.key_value[index].value;
            if (key === "r_nh" && value === "0") {
              shouldCollapseAd = true;
            }
          }
          if (shouldCollapseAd) {
            this.$emit("unfilled");
          }
        }
      } catch (error) {
        if (env.isDev) console.error(error);
      }
    },
    runScript() {
      const wrap = this.$refs.wrap;
      wrap.innerHTML = this.promo.currentVisual.media.mediaUrl;
      setTimeout(() => {
        each(wrap.querySelectorAll("script"), oldScript => {
          const newScript = document.createElement("script");
          each(oldScript.attributes, attr =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped></style>
