<template>
  <v-row dense>
    <v-col
      v-for="i in $r({
        lg: 6,
        md: 4,
        sm: 3,
        xs: 2
      })"
      :key="i"
      lg="2"
      md="3"
      sm="4"
      cols="6"
    >
      <ok-card-loader :target="'AnnouncementMini'"></ok-card-loader>
    </v-col>
  </v-row>
</template>

<script>
import okCardLoader from "@/components/uiKit/loader/okCardLoader";

export default {
  components: { okCardLoader }
};
</script>
