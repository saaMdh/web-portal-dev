<template>
  <profile-announ-list
    v-model:page="page"
    :list="list"
    :loading="$apollo.queries.list.loading > 0"
  ></profile-announ-list>
</template>

<script>
import ProfileAnnounList from "./component/ProfileAnnounList.vue";

export default {
  components: { ProfileAnnounList },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      list: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      },
      count: 10,
      page: 1
    };
  },

  apollo: {
    list: {
      query: require("./Profile.graphql").Likes,
      variables() {
        return {
          count: this.count,
          page: this.page
        };
      }
    }
  }
};
</script>

<style></style>
