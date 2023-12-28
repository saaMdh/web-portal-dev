<template>
  <v-dialog v-model="active" max-width="700" :fullscreen="$isMobile">
    <v-card :tile="$isMobile" :loading="loading > 0">
      <v-card-title class="d-flex justify-space-between">
        {{ $t("announcement.changelog.title") }}
        <v-btn :aria-label="$t('_.close')" icon @click="active = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <template v-if="!loading">
        <template v-if="changelog && changelog.data.length > 0">
          <v-table density="compact">
            <thead>
              <tr>
                <th>{{ $t("announcement.changelog.action") }}</th>
                <th>{{ $t("announcement.changelog.createdAt") }}</th>
                <th>{{ $t("announcement.changelog.user") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in changelog.data" :key="item.id" class="px-5">
                <td>
                  {{ $t(`announcement.changelog.actionValues.${item.action}`) }}
                </td>
                <td>{{ formatDateTime(item.createdAt) }}</td>
                <td>{{ item.user?.displayName }}</td>
              </tr>
            </tbody>
          </v-table>
          <div
            v-if="
              changelog.paginatorInfo && changelog.paginatorInfo.lastPage > 1
            "
            class="text-center mt-4"
          >
            <pagination
              v-if="
                changelog.paginatorInfo && changelog.paginatorInfo.lastPage > 1
              "
              v-model="page"
              :length="changelog.paginatorInfo.lastPage"
            ></pagination>
          </div>
        </template>

        <v-alert v-else tile text type="warning">
          {{ $t(`announcement.changelog.empty`) }}
        </v-alert>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import Pagination from "@/components/Pagination.vue";

const CHANGELOG_QUERY = gql`
  query AnnouncementChangelog($id: ID!, $count: Int, $page: Int) {
    changelog: announcementChangelog(id: $id, count: $count, page: $page) {
      paginatorInfo {
        lastPage
      }
      data {
        id
        action
        createdAt
        user {
          id
          displayName
        }
      }
    }
  }
`;

export default {
  components: {
    Pagination
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },

    announcement: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: 0,
      count: 10,
      page: 1,
      changelog: {
        data: [],
        paginatorInfo: {
          lastPage: 0
        }
      }
    };
  },

  apollo: {
    changelog: {
      fetchPolicy: "network-only",
      loadingKey: "loading",
      query: CHANGELOG_QUERY,
      skip() {
        return !this.modelValue;
      },
      variables() {
        return {
          id: this.announcement.id,
          count: this.count,
          page: this.page
        };
      }
    }
  },

  computed: {
    active: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  }
};
</script>

<style></style>
