<template>
  <div class="container">
    <v-row dense>
      <v-col
        v-for="i in $r({
          lg: 4,
          md: 3,
          sm: 3,
          xs: 1
        })"
        :key="i"
        lg="3"
        md="4"
        sm="4"
        cols="12"
      >
        <ok-card-loader :target="'Store'" class="ma-1"></ok-card-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

export default {
  components: { okCardLoader }
};
</script>
