<template>
  <div class="o-show-admin">
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn
          aria-label="admin tools"
          v-bind="{ ...props, ...$attrs }"
          size="small"
          color="primary"
          icon
          elevation="1"
          :loading="loading > 0"
        >
          <v-icon>mdi-tools</v-icon>
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item
          v-for="(item, i) in menuDisplayed"
          v-bind="item.bind()"
          :key="i"
          class="px-2"
          v-on="item.on()"
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          {{ item.label }}
        </v-list-item>
      </v-list>
    </v-menu>

    <changelog-dialog
      v-model="history.active"
      :announcement="announcement"
    ></changelog-dialog>

    <remove-dialog
      ref="remove"
      v-model="remove.active"
      :is-admin="isAdmin"
      :announcement="announcement"
    ></remove-dialog>
  </div>
</template>

<script>
import MessageBox from "@/mixins/MessageBox";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import RemoveDialog from "./Dialog/RemoveDialog.vue";
import ChangelogDialog from "./Dialog/ChangelogDialog.vue";

import AnnouncementQuery from "../Announcement.graphql";

export default {
  components: { ChangelogDialog, RemoveDialog },
  mixins: [MessageBox],

  props: {
    announcement: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const { user, scope } = useAuthFrame();

    return {
      user,
      scope
    };
  },
  data() {
    return {
      loading: 0,

      history: {
        active: false
      },

      remove: {
        active: false
      }
    };
  },

  computed: {
    menuDisplayed() {
      const menu = [
        {
          icon: "mdi-check-circle-outline",
          label: this.$t("announcement.@.validate.0"),
          display:
            this.isAdmin &&
            ((!this.isDeleted && this.isPending) || this.isEdited),
          on: () => ({ click: this.validate }),
          bind: () => ({})
        },
        {
          icon: "mdi-history",
          label: this.$t("announcement.changelog.title"),
          display: this.isAdmin,
          on: () => ({ click: () => (this.history.active = true) }),
          bind: () => ({})
        },
        {
          icon: "mdi-delete",
          label: this.$t("@.delete.0"),
          display: !this.isDeleted,
          on: () => ({ click: this.delete }),
          bind: () => ({})
        },
        {
          icon: "mdi-pen",
          label: this.$t("@.edit"),
          display: !this.isDeleted && !this.isDisabled,
          on: () => ({}),
          bind: () =>
            this.scope.type === "Admin"
              ? {
                  to: {
                    name: "edit-announcement-admin",
                    params: { id: this.announcement.id }
                  },
                  target: "_blank"
                }
              : {
                  to: {
                    name: "edit-announcement",
                    params: { id: this.announcement.id }
                  },
                  target: "_blank"
                }
        },
        {
          icon: "mdi-cancel",
          label: this.$t("announcement.@.disable.0"),
          display: !this.isDeleted && !this.isDisabled,
          on: () => ({ click: this.disable }),
          bind: () => ({})
        },
        {
          icon: "mdi-refresh",
          label: this.$t("announcement.@.refresh.0"),
          display: !this.isDeleted && !this.isDisabled,
          on: () => ({ click: this.refresh }),
          bind: () => ({})
        },
        {
          icon: "mdi-restore",
          label: this.$t("announcement.@.restore.0"),
          display: this.isDeleted && !this.isDisabled,
          on: () => ({ click: this.restore }),
          bind: () => ({})
        },
        {
          icon: "mdi-backup-restore",
          label: this.$t("announcement.@.enable.0"),
          display: this.isAdmin && !this.isDeleted && this.isDisabled,
          on: () => ({ click: this.enable }),
          bind: () => ({})
        }
      ];
      return menu.filter(v => v.display);
    },

    isDeleted() {
      return this.announcement.status === "DELETED";
    },

    isDisabled() {
      return this.announcement.status === "DISABLED";
    },
    isPending() {
      return this.announcement.status === "PENDING";
    },
    isEdited() {
      return this.announcement.status === "EDITED";
    }
  },

  methods: {
    async delete() {
      const reason = await this.$refs.remove.confirm();

      if (!reason) return;

      this.loading++;
      await this.$apollo.mutate({
        mutation: this.isAdmin
          ? AnnouncementQuery.DeleteForAdmin
          : AnnouncementQuery.Delete,
        variables: this.isAdmin
          ? { id: this.announcement.id, reason }
          : { ids: [this.announcement.id], reason }
      });
      this.$emit("refetch");
      this.loading--;
    },

    async disable() {
      const ok = await this.$confirm({
        title: this.$t("announcement.@.disable.0"),
        message: this.$t("announcement.@.disable.1")
      });

      if (!ok) return;

      this.loading++;
      await this.$apollo.mutate({
        mutation: AnnouncementQuery.Disable,
        variables: { ids: this.announcement.id }
      });
      this.$emit("refetch");
      this.loading--;
    },

    async activate() {
      this.loading++;
      await this.$apollo.mutate({
        mutation: AnnouncementQuery.Enable,
        variables: { id: this.announcement.id, status: "VALIDATE" }
      });
      this.$emit("refetch");
      this.loading--;
    },

    async enable() {
      const ok = await this.$confirm({
        title: this.$t("announcement.@.enable.0"),
        message: this.$t("announcement.@.enable.1")
      });

      if (!ok) return;

      this.activate();
    },

    async validate() {
      const ok = await this.$confirm({
        title: this.$t("announcement.@.validate.0"),
        message: this.$t("announcement.@.validate.1")
      });

      if (!ok) return;

      this.activate();
    },

    async refresh() {
      const ok = await this.$confirm({
        title: this.$t("announcement.@.refresh.0"),
        message: this.$t("announcement.@.refresh.1")
      });

      if (!ok) return;

      this.loading++;
      await this.$apollo.mutate({
        mutation: AnnouncementQuery.Refresh,
        variables: { ids: this.announcement.id }
      });

      setTimeout(() => {
        this.$emit("refetch");
      }, 3500);

      this.loading--;
    },

    async restore() {
      const ok = await this.$confirm({
        title: this.$t("announcement.@.restore.0"),
        message: this.$t("announcement.@.restore.1")
      });

      if (!ok) return;
      this.loading++;
      await this.$apollo.mutate({
        mutation: AnnouncementQuery.Restore,
        variables: {
          ids: [this.announcement.id]
        }
      });
      this.$emit("refetch");
      this.loading--;
    }
  }
};
</script>

<style lang="scss"></style>
