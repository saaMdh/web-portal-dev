<template>
  <v-dialog
    v-model="isOpen"
    class="ok-message-box"
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-text v-if="params.icon" class="text-center pt-5">
        <v-icon
          ref="icon"
          :color="params.iconColor"
          class="ok-message-box__icon"
          size="91"
        >
          {{ params.icon }}
        </v-icon>
      </v-card-text>

      <v-card-text
        v-if="params.title"
        class="text-h6 text-center justify-center"
      >
        {{ params.title }}
      </v-card-text>

      <!-- eslint-disable -->
      <v-card-text
        v-if="params.message"
        class="text-subtitle-1 text-center"
        v-html="params.message"
      >
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="params.rejectButtonShow"
          :aria-label="
            params.rejectButtonLabel
              ? params.rejectButtonLabel
              : $t('params.rejectButtonLabel')
          "
          variant="text"
          @click="reject"
        >
          {{
            params.rejectButtonLabel
              ? params.rejectButtonLabel
              : $t("params.rejectButtonLabel")
          }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="params.acceptButtonShow"
          :aria-label="
            params.acceptButtonLabel
              ? params.acceptButtonLabel
              : $t('params.acceptButtonLabel')
          "
          variant="text"
          @click="accept"
        >
          {{
            params.acceptButtonLabel
              ? params.acceptButtonLabel
              : $t("params.acceptButtonLabel")
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import mitt from "mitt";

const DataDefault = {
  icon: "mdi-alert-outline",
  iconColor: "warning",

  title: null,
  message: null,

  acceptButtonShow: true,
  rejectButtonShow: true
};

export default {
  data() {
    return {
      isOpen: false,

      params: {
        ...DataDefault
      },
      resolver: null
    };
  },

  created() {
    this.events = mitt();
  },
  beforeUnmount() {
    this.events.off("accept", this.acceptPromise);
    this.events.off("reject", this.rejectPromise);
    setTimeout(() => {
      this.resolver = null;
    }, 100);
  },

  methods: {
    open(props) {
      this.params = { ...DataDefault, ...props };
      this.isOpen = true;
      return new Promise(resolver => {
        this.resolver = resolver;
        this.events.on("accept", this.acceptPromise);
        this.events.on("reject", this.rejectPromise);
      });
    },
    reject() {
      this.close();
      this.events.emit("reject");
    },
    accept() {
      this.close();
      this.events.emit("accept");
    },
    acceptPromise() {
      this.resolver(true);
    },
    rejectPromise() {
      this.resolver(false);
    },
    close() {
      this.isOpen = false;
    }
  }
};
</script>

<style lang="scss"></style>
