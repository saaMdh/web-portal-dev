<template>
  <div>
    <v-card class="rounded-lg" elevation="1">
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-avatar color="white">
              <user-avatar :user="user"></user-avatar>
            </v-avatar>
          </template>
          <span class="py-0">
            <v-list-item-title>
              {{ displayName }}
            </v-list-item-title>
          </span>
        </v-list-item>
        <v-list-item
          v-for="(u, index) in userInfos"
          :key="index"
          :color="u.color ? u.color : 'black'"
        >
          <template #prepend>
            <v-icon :color="u.color ? u.color : ''">
              {{ u.icon }}
            </v-icon>
          </template>
          <span class="py-0">
            <v-list-item-subtitle>{{ u.label }}</v-list-item-subtitle>
            <v-list-item-title>{{ u.value }}</v-list-item-title>
          </span>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-icon>mdi-bullhorn-outline</v-icon>
          </template>
          <span class="py-0">
            <v-list-item-subtitle>
              {{ $t("profile.stats.announcements") }}</v-list-item-subtitle
            >
            <v-list-item-title>{{ user.announcementCount }}</v-list-item-title>
          </span>
        </v-list-item>

        <v-list-item>
          <template #prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <span class="py-0">
            <v-list-item-subtitle>
              {{ $t("profile.stats.followers") }}</v-list-item-subtitle
            >
            <v-list-item-title>{{ user.followersCount }}</v-list-item-title>
          </span>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <div class="py-4 d-flex justify-center flex-gap-2">
        <template v-if="!isMyProfile">
          <v-btn
            v-if="iAmFollowing"
            :aria-label="$t('_.unfollow')"
            color="red"
            dark
            depressed
            size="small"
            rounded
            :loading="loading > 0"
            @click.stop.prevent="userUnfollow"
          >
            <v-icon size="small" start>mdi-account-remove</v-icon>
            {{ $t("_.unfollow") }}
          </v-btn>

          <v-btn
            v-else
            :aria-label="$t('_.follow')"
            color="primary"
            dark
            size="small"
            rounded
            depressed
            :loading="loading > 0"
            @click.stop.prevent="userFollow"
          >
            <v-icon size="small" start>mdi-account-star</v-icon>
            {{ $t("_.follow") }}
          </v-btn>

          <v-btn
            v-if="current && isRoleGranted('MESSAGING') && !DISABLE_MESSENGER"
            :aria-label="$t('profile.links.message')"
            dark
            color="secondary"
            depressed
            rounded
            size="small"
            :loading="$messenger.state.loading > 0"
            @click="$messenger.chatWith({ type: 'USER', id: user.id })"
          >
            <v-icon size="small" start>mdi-message</v-icon>
            {{ $t("profile.links.message") }}
          </v-btn>
        </template>
        <v-btn
          v-if="isMyProfile"
          :aria-label="$t('profile.stats.profileSettings')"
          dark
          color="secondary"
          depressed
          rounded
          size="small"
          @click="goTo"
        >
          <v-icon size="small" start>mdi-cog-outline</v-icon>
          {{ $t("profile.stats.profileSettings") }}
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import env from "@/utils/env.js";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

const UserFollow = gql`
  mutation UserFollow($id: ID!) {
    isFollowing: userFollow(id: $id)
  }
`;

const UserUnfollow = gql`
  mutation UserUnfollow($id: ID!) {
    isFollowing: userUnfollow(id: $id)
  }
`;

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { user } = useAuthFrame();

    return {
      current: user
    };
  },

  data() {
    return {
      DISABLE_MESSENGER: parseInt(env.VUE_APP_DISABLE_MESSENGER),
      loading: 0,
      manager: {
        phone: false
      }
    };
  },
  computed: {
    isMyProfile() {
      return this.current ? this.current.id === this.user.id : false;
    },

    displayName() {
      return this.HTMLEncode(this.user.displayName);
    },

    userInfos() {
      return [
        {
          label: this.$t("profile.infos.id"),
          icon: "mdi-pound",
          value: this.user.id
        },
        {
          label: this.$t("profile.infos.status"),
          icon: "mdi-account-circle",
          color: this.user.isOnline ? "green" : "red",
          value: this.$t(
            this.user.isOnline
              ? "profile.infos.online"
              : "profile.infos.offline"
          )
        },
        {
          label: this.$t("profile.infos.createdAt"),
          icon: "mdi-calendar",
          value: this.formatDate(this.user.createdAt)
        }
      ];
    }
  },

  apollo: {
    iAmFollowing: {
      fetchPolicy: "network-only",
      query: gql`
        query IAmFollowing($id: ID!) {
          iAmFollowing(id: $id)
        }
      `,
      variables() {
        return {
          id: this.user.id
        };
      },
      skip() {
        return this.isMyProfile || this.current === null;
      }
    }
  },

  methods: {
    async userFollow() {
      if (!this.current)
        return this.$store.commit("dialog/openDialog", {
          name: "modelConnexion"
        });

      this.loading++;

      await this.$apollo.mutate({
        mutation: UserFollow,
        variables: { id: this.user.id }
      });

      this.iAmFollowing = true;
      this.loading--;
    },

    async userUnfollow() {
      this.loading++;

      await this.$apollo.mutate({
        mutation: UserUnfollow,
        variables: { id: this.user.id }
      });
      this.iAmFollowing = false;
      this.loading--;
    },
    goTo() {
      this.$router.push({
        name: "profile-settings"
      });
    },
    HTMLEncode(str) {
      return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
        return String.fromCharCode(charCode);
      });
    }
  }
};
</script>

<style></style>
