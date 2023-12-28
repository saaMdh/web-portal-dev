<template>
  <div class="d-flex justify-space-between justify-md-end">
    <v-btn
      v-if="!hideDelivery"
      :aria-label="$t('search.filters.delivery')"
      flat
      :variant="!withDelivery ? 'outlined' : 'elevated'"
      size="small"
      :loading="loadingDelivery"
      rounded
      color="green"
      class="mx-1"
      @click="setDelivery"
    >
      {{ $t("search.filters.delivery") }}
      <v-icon v-if="withDelivery" end> mdi-close </v-icon>
      <v-icon v-else end> mdi-truck-check </v-icon>
    </v-btn>
    <v-spacer class="d-md-none"></v-spacer>
    <v-btn
      :aria-label="$t('search.filters.new')"
      flat
      :variant="!withEtatNew ? 'outlined' : 'elevated'"
      :loading="loadingNewEtat"
      size="small"
      rounded
      color="light-blue-darken-2"
      class="mx-1"
      @click="setNewEtat"
    >
      {{ $t("search.filters.new") }}

      <v-icon v-if="withEtatNew" end> mdi-close </v-icon>
    </v-btn>
    <v-btn
      :aria-label="$t('search.filters.occasion')"
      flat
      :variant="!withEtatUsed ? 'outlined' : 'elevated'"
      :loading="loadingUsedEtat"
      size="small"
      rounded
      color="light-blue-darken-2"
      class="mx-1"
      @click="setUsedEtat"
    >
      {{ $t("search.filters.occasion") }}
      <v-icon v-if="withEtatUsed" end> mdi-close </v-icon>
    </v-btn>
  </div>
</template>

<script>
import some from "lodash/some";
const ANNOUNCEMENT_DELIVERY_TYPES = [
  "DELIVERY_AVAILABLE",
  "DELIVERY_PAY_ON_DELIVERY",
  "DELIVERY_FREE"
];
const ANNOUNCEMENT_USED_TYPES = ["etat-2", "etat-3", "etat-4", "etat-0"];
export default {
  props: {
    search: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideDelivery: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loadingDelivery: false,
    loadingNewEtat: false,
    loadingUsedEtat: false
  }),

  computed: {
    showDelivery() {
      return this.search.active.category.delivery;
    },

    withDelivery: {
      get() {
        return some(
          ANNOUNCEMENT_DELIVERY_TYPES,
          s => this.filter.delivery === s
        );
      },

      set(v) {
        this.$emit("apply-delivery", v ? "DELIVERY_AVAILABLE" : null);
      }
    },
    withEtatNew: {
      get() {
        return this.filter.model.etat == "etat-1";
      },
      set(v) {
        this.$emit("apply-etat", v ? "etat-1" : null);
      }
    },
    withEtatUsed: {
      get() {
        return some(ANNOUNCEMENT_USED_TYPES, s => this.filter.model.etat === s);
      },
      set(v) {
        this.$emit("apply-etat", v ? "etat-0" : null);
      }
    }
  },
  watch: {
    loading(val) {
      if (val) return;
      this.loadingDelivery = val;
      this.loadingNewEtat = val;
      this.loadingUsedEtat = val;
    }
  },
  methods: {
    setDelivery: function () {
      const vm = this;
      this.loadingDelivery = true;
      setTimeout(() => {
        vm.loadingDelivery = false;
      }, 500);
      this.withDelivery = this.withDelivery ? null : "DELIVERY_AVAILABLE";
    },
    setNewEtat: function () {
      const vm = this;
      this.loadingNewEtat = true;
      setTimeout(() => {
        vm.loadingNewEtat = false;
      }, 500);
      this.withEtatNew = this.withEtatNew ? null : "etat-1";
    },
    setUsedEtat: function () {
      const vm = this;
      this.loadingUsedEtat = true;
      setTimeout(() => {
        vm.loadingUsedEtat = false;
      }, 500);
      this.withEtatUsed = this.withEtatUsed ? null : "etat-0";
    }
  }
};
</script>

<style></style>
