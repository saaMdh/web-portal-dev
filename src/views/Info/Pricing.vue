<template>
  <v-container class="o-article">
    <h1 class="o-article__title">Qu’est-ce qu’un store ?</h1>

    <p>
      Store est l’offre spécial Ouedkniss dédiée aux professionnels : agence
      immobilière ou de voyage, vente de matériels et produits , services .
    </p>
    <p>
      Avec store vos produits seront directement introduits dans le marché
      virtuel ouedkniss.com qui accueille chaque jours plus de 800 000 clients
      potentiels provenant des 48 wilayas d’Algérie .
    </p>
    <p>
      Certains stores font près de 80% de leurs ventes grâce à la plateforme
      Ouedkniss et ceci en insérant facilement leurs produits plus des photos à
      volonté .
    </p>

    <h2 class="o-article__title">Les avantages</h2>
    <ul>
      <li>Disposer de votre propre site internet (boutique ou agence).</li>
      <li>Activation automatique et instantanée de vos annonces.</li>
      <li>
        Possibilité de remettre vos annonces dans les premières positions.
      </li>
      <li>
        Référencement de votre boutique/agence dans les grands moteurs de
        recherche (Google , Bing , Yahoo, … ).
      </li>
      <li>
        Formulaire de contact + localisation géographique de votre
        magasin/bureau sur une carte interactive.
      </li>
      <li>
        Bénéficier du grand trafic de Ouedkniss.com ( +800 000 visiteurs par
        jour )
      </li>
    </ul>

    <h2 class="o-article__title">Packs et tarifs Stores</h2>

    <store-price v-model="storePurchaseInput" class="mt-4"></store-price>

    <v-container grid-list-lg class="mt-4">
      <v-row>
        <v-col md="3" cols="12">
          <v-card color="#4CAF50" style="background-color: #4CAF50 !important;" class="text-center font-weight-light">
            <v-card-text>
              <span class="text-h4">1 mois offert</span><br />
              pour<br />
              <span class="text-h5">6 mois<br />d'engagement</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="3" cols="12">
          <v-card color="#4CAF50" style="background-color: #4CAF50 !important;" class="text-center font-weight-light">
            <v-card-text>
              <span class="text-h4">3 mois offert</span><br />
              pour<br />
              <span class="text-h5">12 mois<br />d'engagement</span>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col md="6" cols="12">
          <v-alert color="green" icon="mdi-asterisk" class="my-1">
            Pour un engagement minimum de 3 mois.
          </v-alert>
          <v-alert color="red" icon="mdi-alert-box-outline" class="my-1">
            NB : Registre de commerce exigé pour les catégories Immobilier,
            Automobiles & Voyage.
          </v-alert>
        </v-col>
      </v-row>

      <div class="text-center my-5">
        <v-btn
          aria-label="Commander un store"
          color="primary"
          rounded
          size="x-large"
          :to="{ name: 'order-store' }"
        >
          Commander un store
          <v-icon end>mdi-cart</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import StorePrice from "./Desktop/StorePrice.vue";
export default {
  components: {
    StorePrice
  },
  data() {
    return {
      storePurchaseInput: {
        serviceId: 0,
        categoryIds: [],
        duration: 1,
        name: "",
        description: undefined,
        logoUrl: [],
        tradeRegistry: [],
        startAt: new Date(),
        domainName: undefined,
        tradeRegistryIsSent: false
      },
      loadingMutation: false
    };
  }
};
</script>

<style lang="scss"></style>
