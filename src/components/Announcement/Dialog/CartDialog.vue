<template>
  <v-dialog v-model="active" max-width="600px">
    <v-form @submit.prevent>
      <v-card>
        <v-toolbar :elevation="4" color="transparent">
          <v-toolbar-title>{{ $t("announcement.cart") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon density="comfortable" @click="close"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-progress-linear
          indeterminate
          :active="loading > 0"
        ></v-progress-linear>
        <template v-if="announcement && loading == 0">
          <v-alert
            v-if="hideDelivery"
            variant="tonal"
            density="compact"
            tile
            class="ma-0"
          >
            {{ $t("announcement.delivery.notAvailable") }}
          </v-alert>
          <show-delivery
            v-else
            class="mt-2"
            :announcement="announcement"
            @done="close"
          ></show-delivery>
        </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close">{{ $t("_.close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import Queries from "@/views/Announcement/Announcement.graphql";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    ShowDelivery: defineAsyncComponent(() =>
      import(
        "@ouedkniss/web-cart-plugin/src/components/Announcement/ShowDelivery.vue"
      )
    )
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: 0,
      announcement: null
    };
  },
  computed: {
    hideDelivery() {
      const variants = this.announcement.variants;
      const pricePreview = this.announcement.pricePreview;
      if (!variants) return !pricePreview;
      return (
        this.announcement.category.deliveryType !== "SERVICE" &&
        !variants.some(v => v.price > 0) &&
        !pricePreview
      );
    },
    active: {
      get() {
        const value = this.$store.state.dialog.modelCart;
        if (value) this.open();
        return value;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelCart" });
      }
    }
  },
  methods: {
    open() {
      this.announcement = this.$store.getters.announcement;
    },
    close() {
      this.active = false;
    }
  },
  apollo: {
    announcement: {
      loadingKey: "loading",
      fetchPolicy: "network-only",
      query: Queries.AnnouncementGet,
      variables() {
        return {
          id: this.announcement.id
        };
      },
      skip() {
        return !this.announcement;
      }
    }
  }
};
</script>

<style></style>
