<template>
  <div>
    <template v-if="$apollo.queries.list.loading">
      <v-skeleton-loader type="list-item-avatar@2"></v-skeleton-loader>
    </template>
    <template v-else>
      <v-list v-if="list.data.length > 0" density="comfortable">
        <template v-for="(item, index) in list.data" :key="item.id">
          <template v-if="item.targetType === 'Store'">
            <v-list-item
              :to="{
                name: 'store',
                params: { storeId: item.id, storeSlug: item.slug }
              }"
            >
              <template #prepend>
                <v-avatar :size="28" :image="item.image"></v-avatar>
              </template>

              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.slug }}</v-list-item-subtitle>

              <template #append>
                <v-btn
                  :aria-label="$t('_.delete')"
                  color="red"
                  icon
                  variant="text"
                  density="comfortable"
                  :loading="loading > 0"
                  @click.stop.prevent="storeUnfollow(item.id)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item
              :to="{
                name: 'profile',
                params: { id: item.id }
              }"
            >
              <template #prepend>
                <user-avatar :user="{...item, avatarUrl: item.image }" />
              </template>

              <v-list-item-title>{{ item.displayName }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.username }}</v-list-item-subtitle>

              <template #append>
                <v-btn
                  :aria-label="$t('_.delete')"
                  color="red"
                  icon
                  variant="text"
                  density="comfortable"
                  :loading="loading > 0"
                  @click.stop.prevent="userUnfollow(item.id)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
            </v-list-item>
          </template>
          <v-divider
            v-if="index < list.data.length - 1"
            :key="'d' + item.id"
          ></v-divider>
        </template>
      </v-list>

      <data-placeholder
        v-else
        icon="mdi-account-star"
        :scale="$isDesktop ? 0.6 : 0.6"
        class="px-8"
      >
        {{ $t("profile.subscriptions.empty") }}
      </data-placeholder>

      <div v-if="list.paginatorInfo.lastPage > 1" class="text-center py-4">
        <pagination
          v-model="page"
          :length="list.paginatorInfo.lastPage"
        ></pagination>
      </div>
    </template>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Pagination from "@/components/Pagination.vue";
const UserUnfollow = gql`
  mutation UserUnfollow($id: ID!) {
    isFollowing: userUnfollow(id: $id)
  }
`;
const StoreUnfollow = gql`
  mutation ($storeId: ID!) {
    storeUnfollow(id: $storeId)
  }
`;
export default {
  components: { Pagination },
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: 0,
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
      query: require("./Profile.graphql").UserFollowingAll,
      fetchPolicy: "network-only",
      variables() {
        return {
          page: this.page,
          count: this.count
        };
      }
    }
  },

  methods: {
    async userUnfollow(id) {
      this.loading++;

      await this.$apollo.mutate({
        mutation: UserUnfollow,
        variables: { id: id }
      });

      this.$apollo.queries.list.refetch();
      this.loading--;
    },
    async storeUnfollow(id) {
      this.loading++;

      await this.$apollo.mutate({
        mutation: StoreUnfollow,
        variables: { storeId: id }
      });

      this.$apollo.queries.list.refetch();
      this.loading--;
    }
  }
};
</script>

<style></style>
