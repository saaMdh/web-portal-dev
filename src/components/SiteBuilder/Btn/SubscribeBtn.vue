<template>
  <div>
    <v-btn
      v-if="iAmFollowing"
      variant="tonal"
      size="small"
      class="px-2"
      :loading="loading > 0"
      @click="subscribe"
    >
      <v-icon start>mdi-bell-check</v-icon>
      {{ $t("_.subscribed") }}
    </v-btn>

    <v-btn
      v-else
      variant="tonal"
      size="small"
      class="px-2"
      :loading="loading > 0"
      @click="subscribe"
    >
      <v-icon start>mdi-bell-ring</v-icon>
      {{ $t("_.subscribe") }}
    </v-btn>
  </div>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";

import { mapGetters } from "vuex";
import gql from "graphql-tag";

const SUBSCRIBE_MUTATION = gql`
  mutation ($storeId: ID!) {
    storeFollow(id: $storeId)
  }
`;

const UNSUBSCRIBE_MUTATION = gql`
  mutation ($storeId: ID!) {
    storeUnfollow(id: $storeId)
  }
`;

export default {
  mixins: [MessageBox],

  data() {
    return {
      loading: 0,
      iAmFollowing: false
    };
  },

  computed: {
    ...mapGetters({ store: "builder/store" })
  },

  mounted() {
    this.iAmFollowing = this.store.iAmFollowing;
  },

  methods: {
    async subscribe() {
      this.loading++;
      try {
        await this.$apollo.mutate({
          mutation: this.iAmFollowing
            ? UNSUBSCRIBE_MUTATION
            : SUBSCRIBE_MUTATION,
          variables: {
            storeId: this.store.id
          }
        });

        this.iAmFollowing = !this.iAmFollowing;
      } catch (error) {
        await this.$error({
          message: error.message
        });
      }

      this.loading--;
    }
  }
};
</script>

<style></style>
