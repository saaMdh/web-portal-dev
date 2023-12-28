<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="$vuetify.display.smAndDown"
    persistent
    max-width="400px"
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <v-card>
      <v-card-title class="text-primary pa-3">
        {{ t("title") }}
        <v-spacer></v-spacer>
        <v-icon @click="$emit('update:modelValue', false)">mdi-close</v-icon>
      </v-card-title>

      <v-list>
        <v-list-item
          v-for="item in users"
          :key="item.user.id"
          @click="$emit('submit', item)"
        >
          <template #prepend>
            <v-avatar>
              <user-avatar :user="item.user"></user-avatar>
            </v-avatar>
          </template>

          <span>
            <v-list-item-title>{{ item.user.displayName }}</v-list-item-title>
          </span>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    users: {
      type: Array,
      default: () => []
    }
  },

  setup() {
    const { t } = useI18n({
      messages: {
        fr: {
          min: "Min",
          max: "Max"
        },
        ar: {
          min: "الأدنى",
          max: "الأقصى"
        },
        en: {
          min: "Min",
          max: "Max"
        }
      }
    });
    return { t };
  }
};
</script>

<style lang="scss">
.v-theme--dark {
  .v-overlay--active {
    .v-overlay__scrim {
      opacity: 0.86 !important;
      background-color: rgb(63 63 63) !important;
      border-color: rgb(33, 33, 33) !important;
    }
  }
}
</style>
