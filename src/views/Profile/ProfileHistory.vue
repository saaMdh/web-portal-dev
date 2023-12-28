<template>
  <div>
    <profile-announ-list
      v-model:page="page"
      :list="list"
      :loading="$apollo.queries.list.loading > 0"
    ></profile-announ-list>
  </div>
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
      query: require("./Profile.graphql").History,
      variables() {
        return {
          page: this.page,
          count: this.count
        };
      }
    }
  }
};
</script>

<style></style>
