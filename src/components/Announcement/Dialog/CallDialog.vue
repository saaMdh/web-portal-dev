<template>
  <v-dialog v-model="active" max-width="600px">
    <v-form @submit.prevent>
      <v-card v-if="announcement" class="pb-2">
        <v-card-title class="d-flex align-center py-3 elevation-2 mb-2">
          {{
            announcement.dialogType == "call"
              ? $t("announcement.user.phone")
              : $t("announcement.message")
          }}
          <v-spacer></v-spacer>
          <v-btn icon density="comfortable" @click="close"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-card-title>
        <show-user-phones
          :key="'call-dilaog-' + key"
          :announcement="announcement"
          @close="close"
        ></show-user-phones>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";
export default {
  components: {
    ShowUserPhones: defineAsyncComponent(() =>
      import("@/views/Announcement/components/ShowUserPhones.vue")
    )
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: 0,
      key: 0,
      announcement: null
    };
  },
  computed: {
    active: {
      get() {
        const value = this.$store.state.dialog.modelCall;
        if (value) this.open();
        return value;
      },
      set(v) {
        const toggle = v ? "openDialog" : "closeDialog";
        this.$store.commit(`dialog/${toggle}`, { name: "modelCall" });
        if (!v) {
          this.announcement = null;
          this.$store.commit("app/setAnnouncement", null);
        }
      }
    }
  },
  methods: {
    open() {
      this.announcement = this.$store.getters.announcement;
      this.key++;
    },
    close() {
      this.active = false;
    }
  }
};
</script>

<style></style>
