<template>
  <v-list rounded class="py-0" density="compact">
    <template v-for="item in params">
      <v-list-item v-if="!item.hidden" :key="item.code" link>
        <span>
          <v-list-item-title class="text-wrap">{{
            item.label
          }}</v-list-item-title>
        </span>

        <template #append>
          <template v-if="item.valueType == 'OPTION'">
            <v-avatar>
              <v-icon v-if="item.values[index] != null" size="32" color="green">
                mdi-check-circle-outline
              </v-icon>
              <v-icon
                v-if="item.values[index] && item.values[index].isImportant"
                size="14"
                color="amber-darken-1"
              >
                mdi-asterisk
              </v-icon>

              <v-icon v-if="!item.values[index]" size="32" color="red">
                mdi-close-circle-outline
              </v-icon>
            </v-avatar>
          </template>

          <span v-else>{{ item.values[index].value }}</span>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
export default {
  props: {
    params: { type: Array, default: null },
    index: { type: Number, default: 0 }
  },
  data() {
    return {};
  }
};
</script>
