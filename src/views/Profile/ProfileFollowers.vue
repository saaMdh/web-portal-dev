<template>
  <div>
    <template v-if="$apollo.queries.list.loading">
      <v-skeleton-loader type="list-item-avatar-two-line@2"></v-skeleton-loader>
    </template>
    <template v-else>
      <v-list v-if="list.data.length > 0" flat>
        <template v-for="(item, index) in list.data" :key="item.id">
          <v-list-item
            flat
            :to="{
              name: 'profile',
              params: { id: item.id }
            }"
          >
            <template #prepend>
              <user-avatar :user="item" />
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
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-list-item>
          <v-divider
            v-if="index < list.data.length - 1"
            :key="'d' + item.id"
          ></v-divider>
        </template>
      </v-list>

      <data-placeholder
        v-else
        icon="mdi-account-heart"
        :scale="$isDesktop ? 0.6 : 0.6"
        class="px-8"
      >
        {{ $t("profile.followers.empty") }}
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
import Pagination from "@/components/Pagination.vue";
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
      query: require("./Profile.graphql").UserFollowers,
      fetchPolicy: "network-only",
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
