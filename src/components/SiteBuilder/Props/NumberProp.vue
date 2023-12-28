<template>
  <v-row no-gutters justify="center" align="center" class="text-center">
    <v-col>
      <v-btn icon variant="text" @click="dec"
        ><v-icon>mdi-minus</v-icon></v-btn
      >
    </v-col>
    <v-col>
      <span>{{ modelValue }}/{{ max }}</span>
    </v-col>
    <v-col>
      <v-btn icon variant="text" @click="inc"><v-icon>mdi-plus</v-icon></v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 5
    },
    label: {
      type: String,
      default: null
    }
  },

  data() {
    return {};
  },

  methods: {
    inc() {
      this.$emit("update:modelValue", Math.min(this.modelValue + 1, this.max));
    },
    dec() {
      this.$emit("update:modelValue", Math.max(this.modelValue - 1, this.min));
    }
  }
};
</script>

<style></style>
