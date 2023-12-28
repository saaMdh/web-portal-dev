<template>
  <v-dialog v-model="active" max-width="700" :fullscreen="$isMobile">
    <v-card :tile="$isMobile">
      <v-card-title class="d-flex justify-space-between">
        {{ $t("announcement.remove.title") }}
        <v-btn :aria-label="$t('_.close')" icon @click="active = false"
          ><v-icon>mdi-close</v-icon></v-btn
        >
      </v-card-title>

      <v-card-text>
        <v-select
          v-model="reason"
          filled
          :items="isAdmin ? reasonList : reasonListMember"
          :label="$t('announcement.remove.label')"
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn :aria-label="$t('_.close')" text @click="reject">{{
          $t("_.close")
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :aria-label="$t('_.submit')"
          variant="text"
          color="primary"
          @click="accept"
          >{{ $t("_.submit") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import mitt from "mitt";
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    announcement: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      reason: null,
      reasonList: [
        {
          value: "EXPIRED",
          title: this.$t("announcement.remove.reason.EXPIRED")
        },
        {
          value: "REDUNDANT",
          title: this.$t("announcement.remove.reason.REDUNDANT")
        },
        {
          value: "WRONG_CATEGORY",
          title: this.$t("announcement.remove.reason.WRONG_CATEGORY")
        },
        {
          value: "INCOMPREHENSIBLE",
          title: this.$t("announcement.remove.reason.INCOMPREHENSIBLE")
        },
        {
          value: "DOUBTFUL_OR_ILLEGAL_CONTENT",
          title: this.$t(
            "announcement.remove.reason.DOUBTFUL_OR_ILLEGAL_CONTENT"
          )
        },
        {
          value: "CONTAINS_MULTIPLE_PRODUCTS",
          title: this.$t("announcement.remove.reason.CONTAINS_MULTIPLE_PRODUCTS")
        }
      ],
      reasonListMember: [
        {
          value: "SOLD_BY_OUEDKNISS",
          title: this.$t("announcement.remove.reason.SOLD_BY_OUEDKNISS")
        },
        {
          value: "SOLD_OUTSIDE_OUEDKNISS",
          title: this.$t("announcement.remove.reason.SOLD_OUTSIDE_OUEDKNISS")
        },
        {
          value: "DO_NOT_WANT_TO_SELL_ANYMORE",
          title: this.$t(
            "announcement.remove.reason.DO_NOT_WANT_TO_SELL_ANYMORE"
          )
        }
      ]
    };
  },

  computed: {
    active: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },

  created() {
    this.events = mitt();
  },

  methods: {
    confirm() {
      this.active = true;

      return new Promise(resolve => {
        this.events.on("accept", () => resolve(this.reason));
        this.events.on("reject", () => resolve(null));
      });
    },
    accept() {
      if (!this.reason) return;

      this.active = false;
      this.events.emit("accept");
    },
    reject() {
      this.active = false;
      this.events.emit("reject");
    }
  }
};
</script>

<style></style>
