<template>
  <div class="category-chip-field">
    <v-item-group v-model="selected" v-bind="$attrs" class="pb-4">
      <swiper
        v-slot="{ item }"
        :items="$store.getters.categories"
        slides-per-view="auto"
        :space-between="6"
        navigation-ex
      >
        <v-item v-slot="{ active, toggle }" :model-value="item">
          <v-btn
            :aria-label="item.name"
            class="category-chip"
            :input-value="active"
            depressed
            rounded
            light
            active-class="category-chip-active"
            @click="toggle"
          >
            <template v-if="loading && active">
              <v-progress-circular
                size="24"
                indeterminate
              ></v-progress-circular>
            </template>

            <template v-else>
              <v-avatar size="24">
                <category-img :category="item"></category-img>
              </v-avatar>
            </template>

            <span class="mx-2">{{ item.name }}</span>
          </v-btn>
        </v-item>
      </swiper>
    </v-item-group>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },
  props: {
    modelValue: {
      type: [Object, String],
      default: null
    },

    returnSlug: {
      type: Boolean,
      default: false
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    selected: {
      set(v) {
        if (this.returnSlug) this.$emit("update:modelValue", v ? v.slug : null);
        else this.$emit("update:modelValue", v);

        this.$emit("select", v);
      },
      get() {
        if (this.returnSlug)
          return this.$store.getters.categories.find(
            c => this.modelValue == c.slug
          );
        else return this.modelValue;
      }
    }
  }
};
</script>

<style lang="scss">
.v-theme--light {
  .category-chip-field .category-chip {
    background-color: #e9e9e9 !important;
  }
  .category-chip-field .category-chip-active {
    background-color: #ffffff !important;
  }
}

.v-theme--dark {
  .category-chip-field .category-chip {
    background-color: #222 !important;
    color: #fff !important;
  }
  .category-chip-field .category-chip-active {
    background-color: #111 !important;
  }
}
</style>
