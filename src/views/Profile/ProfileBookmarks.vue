<template>
  <profile-announ-list
    v-model:page="page"
    :list="list"
    :loading="$apollo.queries.list.loading > 0"
    :show-removebtn="true"
    @remove="removeBookmark"
    @click="$emit('click')"
  ></profile-announ-list>
</template>

<script>
import ProfileAnnounList from "./component/ProfileAnnounList.vue";
import MessageBox from "@/mixins/MessageBox";
import { BookmarksRemove } from "@/views/Profile/Profile.graphql";

export default {
  components: { ProfileAnnounList },
  mixins: [MessageBox],

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

  methods: {
    async removeBookmark(id) {
      const confirm = await this.$confirm({
        title: this.$t("@.delete.0"),
        message: this.$t("@.delete.1"),
        icon: "mdi-bookmark-remove"
      });

      if (!confirm) return;

      await this.$apollo.mutate({
        mutation: BookmarksRemove,
        variables: {
          id: id
        }
      });

      this.$apollo.queries.list.refetch();
    }
  },
  apollo: {
    list: {
      fetchPolicy: "network-only",
      query: require("./Profile.graphql").Bookmarks,
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
