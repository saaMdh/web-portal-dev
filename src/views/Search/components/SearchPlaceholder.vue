<template>
  <v-container :style="{ width: '100%', overflowX: 'hidden' }">
    <div class="d-flex flex-gap-4 mt-4">
      <v-skeleton-loader
        type="image"
        height="200"
        width="960"
      ></v-skeleton-loader>

      <v-skeleton-loader
        type="image"
        height="200"
        width="300"
      ></v-skeleton-loader>
    </div>

    <div class="d-flex justify-space-between flex-gap-4 mt-4">
      <v-skeleton-loader
        v-for="i in 7"
        :key="i"
        type="image"
        width="100%"
        height="170"
      ></v-skeleton-loader>
    </div>

    <div class="d-flex flex-gap-4 mt-10">
      <v-skeleton-loader
        type="image"
        height="200"
        width="100%"
      ></v-skeleton-loader>
    </div>

    <div class="d-flex flex-gap-4 my-10">
      <v-skeleton-loader
        v-for="i in $r({
          xs: 1,
          sm: 2,
          md: 4
        })"
        :key="i"
        width="300"
        type="card"
      ></v-skeleton-loader>
    </div>
  </v-container>
</template>

<script>
export default {};
</script>

<style></style>
