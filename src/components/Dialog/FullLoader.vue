<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
    @update:model-value="v => $emit('update:modelValue', v)"
  >
    <v-card color="primary" dark tile flat height="100%">
      <v-container fill-height>
        <v-row justify="center" align="center">
          <v-col cols="12" md="4" class="text-center">
            <div>
              <img src="@/assets/logo-v-w.svg" />
            </div>

            <v-progress-linear
              class="mt-4"
              height="8"
              color="white"
              :indeterminate="true"
            ></v-progress-linear>

            <div class="mt-4">
              <slot></slot>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean
    }
  }
};
</script>

<style></style>
