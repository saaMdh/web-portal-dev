<template>
  <div class="container">
    <v-row class="d-flex justify-space-between mx-md-12" no-gutters>
      <v-col
        v-for="i in $r({
          lg: 9,
          md: 8,
          sm: 6,
          xs: 4
        })"
        :key="i"
        lg="1"
        md="1"
        sm="2"
        cols="3"
        class="d-flex justify-center"
      >
        <ok-circle-loader
          class="mb-4"
          :size="
            $r({
              xl: '80px',
              lg: '80px',
              md: '80px',
              sm: '70px',
              xs: '55px'
            })
          "
          :animated="false"
          label="true"
        ></ok-circle-loader>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-space-between mx-md-12" no-gutters>
      <v-col
        v-for="i in $r({
          lg: 9,
          md: 8,
          sm: 6,
          xs: 4
        })"
        :key="i"
        lg="1"
        md="1"
        sm="2"
        cols="3"
        class="d-flex justify-center"
      >
        <ok-circle-loader
          class="mb-4"
          :size="
            $r({
              xl: '80px',
              lg: '80px',
              md: '80px',
              sm: '70px',
              xs: '55px'
            })
          "
          :animated="false"
          label="true"
        ></ok-circle-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import okCircleLoader from "@/components/uiKit/loader/okCircleLoader";

export default {
  components: { okCircleLoader }
};
</script>
<style scoped>
@media (min-width: 960px) {
  .col-md-1 {
    flex: 0 0 8.3%;
    max-width: 16.6% !important;
  }
}
</style>
