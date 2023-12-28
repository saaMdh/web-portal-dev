<template>
  <v-container>
    <template v-if="!IsBotAgent()">
      <div class="o-wrong-turn d-flex justify-center align-center mt-16">
        <div class="text-center text-primary px-4">
          <template v-if="onLine == false">
            <v-icon x-size="large">mdi-wifi-remove</v-icon>
            <h2 class="text-h5 mt-4">{{ $t("_.offLine") }}</h2>
          </template>
          <template v-else>
            <h1 class="text-h2">(⌐■_■)</h1>
            <h2 class="text-h5 mt-4">{{ title }}</h2>
            <h2 class="text-body-1">{{ text }}</h2>
          </template>

          <v-btn
            :aria-label="$t('announcement.notFound.2')"
            variant="text"
            rounded
            class="mt-4"
            :to="{ name: 'home' }"
            exact
          >
            <v-icon start>mdi-home</v-icon> {{ $t("announcement.notFound.2") }}
          </v-btn>
        </div>
      </div>

      <show-suggested v-if="id" :id="id" class="mt-6"></show-suggested>
    </template>
    <template v-else>
      <div class="o-wrong-turn d-flex justify-center align-center mt-16">
        <div class="text-center text-primary px-4">
          <h1 class="text-h2">(⌐■_■)</h1>
          <h2 class="text-h5 mt-4">{{ title }}</h2>
          <h2 class="text-body-1">{{ text }}</h2>

          <v-btn
            :aria-label="$t('announcement.notFound.2')"
            variant="text"
            rounded
            class="mt-4"
            :to="{ name: 'home' }"
            exact
          >
            <v-icon start>mdi-home</v-icon> {{ $t("announcement.notFound.2") }}
          </v-btn>
        </div>
      </div>

      <show-suggested v-if="id" :id="id" class="mt-6"></show-suggested>
    </template>
  </v-container>
</template>

<script>
import ShowSuggested from "../../views/Announcement/components/ShowSuggested";
import { IsBotAgent } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import { mapGetters } from "vuex";
export default {

  components: {
    ShowSuggested
  },
  props: {
    id: [String, Number],
    text: String,
    title: String
  },
  computed: {
    ...mapGetters(["onLine"])
  },
  methods: {
    IsBotAgent: () => IsBotAgent()
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-wrong-turn {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  h3 {
    font-size: 2vw;
  }
}
</style>
