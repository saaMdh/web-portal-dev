<template>
  <div>
    <template v-for="(v, i) in item.valueText" :key="i">
      <template
        v-if="item.specification && item.specification.type === 'CHECK'"
      >
        <v-icon v-if="v === '1'" color="green"
          >mdi-checkbox-marked-outline
        </v-icon>
        <v-icon v-else color="red">mdi-close-box-outline</v-icon>
      </template>
      <template v-else>
        <v-chip
          v-if="item.valueText.length > 1"
          size="small"
          color="light"
          class="me-1 mb-1"
        >
          {{ v }}
        </v-chip>
        <span v-else class="me-1 mb-1">
          {{ v }}
        </span>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss"></style>
