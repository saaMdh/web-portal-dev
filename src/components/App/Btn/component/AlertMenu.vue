<template>
  <v-menu
    v-model="active"
    v-bind="menuBind"
    offset="10"
    location="bottom center"
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        :aria-label="$t('_.notifications')"
        icon
        :loading="loading"
        :ripple="false"
        v-bind="props"
      >
        <v-badge end overlap :model-value="nbItems > 0">
          <template #badge>{{ nbItems }}</template>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <alert-list v-if="active" @close="active = false"></alert-list>
  </v-menu>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    AlertList: defineAsyncComponent({
      delay: 1000,
      loader: () =>
        import(
          /* webpackPrefetch: true */ "@ouedkniss/web-notification-plugin/src/components/AlertList.vue"
        )
    })
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    nbItems: {
      type: [Number, String],
      default: 0
    },
    menuBind: {
      type: Object,
      default: () => {}
    }
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
  }
};
</script>

<style></style>
