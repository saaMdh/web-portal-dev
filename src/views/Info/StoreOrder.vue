<template>
  <v-container class="o-article">
    <h1 class="o-article__title">Commander abonnement Store</h1>
    <template v-if="user">
      <v-row justify="center">
        <v-col cols="8">
          <v-form>
            <v-select
              v-model="form.paiementId"
              :items="paiementList"
              item-title="name"
              item-value="id"
              variant="outlined"
              hide-details
              label="Méthode de paiement :"
              class="mb-4"
            ></v-select>

            <ValidationProvider v-slot="{ errors }" rules="required">
              <v-text-field
                v-model="form.nameStore"
                label="Votre nom sur ouedkniss"
                class="my-4"
                :error-messages="errors"
                variant="outlined"
                hide-details
              ></v-text-field>
            </ValidationProvider>

            <v-select
              v-model="form.regionId"
              :items="regionList"
              item-title="name"
              item-value="id"
              variant="outlined"
              dense
              hide-details
              label="Votre Adresse 'Wilaya'"
              class="mb-4"
            ></v-select>
            <v-select
              v-model="form.activityId"
              :items="$store.getters.categories"
              item-title="name"
              item-value="id"
              variant="outlined"
              dense
              hide-details
              label="Domaine d'activité"
              class="mb-4"
            ></v-select>
            <v-select
              v-model="form.storeTypeId"
              :items="storeServiceList"
              item-title="name"
              item-value="id"
              variant="outlined"
              dense
              hide-details
              label="Type de store 'Offre'"
              class="mb-4"
            ></v-select>
            <v-textarea
              v-model="form.infos"
              variant="outlined"
              label="Informations supplémentaires"
            ></v-textarea>
            <vue-recaptcha
              ref="recaptcha"
              :model-value="recaptchaToken"
              @update:modelValue="onVerify"
            >
            </vue-recaptcha>

            <div class="text-right">
              <v-btn
                :aria-label="$t('_.send')"
                color="primary"
                type="submit"
                depressed
                rounded
                >{{ $t("_.send") }}</v-btn
              >
            </div>
          </v-form>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <data-placeholder icon="mdi-account">
            <v-alert type="warning" text border="left right">
              Ce formulaire est réservé aux professionels seulement , si vous
              avez déjà un compte veuillez vous connecter, si vous avez besoin
              d'un compte particulier gratuit
              <router-link :to="{ name: 'login' }" target="_blank">
                <b>inscrivez vous</b>
              </router-link>
              et <b>déposez</b> vos annonces gratuitement
              <br />
              Les abonnements store sont payants à partir de 1000 da / mois ...
              <br />
              <router-link :to="{ name: 'pricing' }" target="_blank">
                <b>Cliquer ici pour consulter les tarifs</b>
              </router-link>
            </v-alert>

            <template #actions>
              <v-btn
                :aria-label="$t('_.login')"
                :to="{ name: 'login' }"
                color="primary"
                rounded
                >{{ $t("_.login") }}</v-btn
              >
            </template>
          </data-placeholder>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import { Checkbox as VueRecaptcha, useRecaptchaProvider } from "vue-recaptcha";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import env from "@/utils/env.js";

export default {
  components: {
    VueRecaptcha
  },
  setup() {
    const { user } = useAuthFrame();
    useRecaptchaProvider();
    return {
      user
    };
  },
  data() {
    return {
      recaptchaKey: env.VUE_APP_RECAPTCHA_KEY,

      paiementList: [
        { id: 1, name: "Au niveau de notre bureau par espèce ou chèque" },
        { id: 2, name: "Virement ou versement CCP" },
        { id: 3, name: "Virement ou versement bancaire" },
        { id: 4, name: "À distance par agent de recouvrement" },
        { id: 5, name: "Autre" }
      ],
      regionList: [],
      storeServiceList: [],

      form: {
        paiementId: null,
        nameStore: "",
        regionId: null,
        activityId: null,
        storeTypeId: null,
        infos: "",
        robot: false
      }
    };
  },
  apollo: {
    regionList: gql`
      {
        regionList {
          id
          name
        }
      }
    `,
    storeServiceList: gql`
      {
        storeServiceList {
          id
          name
        }
      }
    `
  },
  methods: {
    submit() {
      if (!this.form.robot) return;

      // TODO : Implement post storeOrder API
    },
    onVerify(response) {
      if (response) this.form.robot = true;
    }
  }
};
</script>

<style></style>
