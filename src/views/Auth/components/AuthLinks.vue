<template>
  <v-card elevation="1">
    <v-list lines="two" class="py-0">
      <v-list-item v-if="login" :to="{ name: 'login' }">
        <template #prepend>
          <v-avatar>
            <v-icon>mdi-account-check</v-icon>
          </v-avatar>
        </template>
        <span>
          <v-list-item-title>
            {{ $t("register.links.login.0") }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("register.links.login.1") }}
          </v-list-item-subtitle>
        </span>
      </v-list-item>
      <v-list-item v-if="register" :to="{ name: 'register' }">
        <template #prepend>
          <v-avatar>
            <v-icon>mdi-account-plus</v-icon>
          </v-avatar>
        </template>
        <span>
          <v-list-item-title>{{
            $t("login.links.register.0")
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("login.links.register.1") }}
          </v-list-item-subtitle>
        </span>
      </v-list-item>

      <v-list-item v-if="reset" :to="{ name: 'reset_password_request' }">
        <template #prepend>
          <v-avatar>
            <v-icon>mdi-lock-question</v-icon>
          </v-avatar>
        </template>
        <span>
          <v-list-item-title>{{
            $t("login.links.forget.0")
          }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("login.links.forget.1") }}
          </v-list-item-subtitle>
        </span>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="$emit('gotoPortal')">
        <template #prepend>
          <v-avatar>
            <v-icon>mdi-undo-variant</v-icon>
          </v-avatar>
        </template>
        <span>
          <v-list-item-title>{{
            $t("login.links.return.0")
          }}</v-list-item-title>
        </span>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    register: {
      type: Boolean,
      default: false
    },
    login: {
      type: Boolean,
      default: false
    },
    reset: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
