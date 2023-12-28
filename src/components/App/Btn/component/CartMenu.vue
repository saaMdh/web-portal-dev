<template>
  <v-menu
    v-model="active"
    v-bind="menuBind"
    offset="10"
    location="bottom end"
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn :aria-label="$t('_.cart')" icon v-bind="props" :ripple="false">
        <v-badge end overlap :model-value="nbItems > 0">
          <template #badge>{{ nbItems }}</template>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <cart-list v-if="active" @close="active = false"></cart-list>
  </v-menu>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    CartList: defineAsyncComponent({
      delay: 1000,
      loader: () =>
        import(
          /* webpackPrefetch: true */ "@ouedkniss/web-cart-plugin/src/components/CartList.vue"
        )
    })
  },
  props: {
    modelValue: {
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
    },
    loading: {
      type: [Number, String],
      default: 0
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
