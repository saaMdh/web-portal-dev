<template>
  <div class="search-header d-flex align-center">
    <template v-if="!searchHeader || loading">
      <ok-text-loader :width="180"></ok-text-loader>
    </template>
    <div v-else>
      <json-ld v-if="jsonld" :jsonld="jsonld" type="breadcrumb"></json-ld>
      <template v-if="modelValue">
        <span v-if="hasSuggested" class="h1">
          <h1>
            {{ modelValue }}
          </h1>
          {{ searchQuery !== null ? "- " + searchQuery : "" }}
        </span>
        <h1 v-else>
          {{ modelValue }} - {{ searchHeader.category.name }}
          {{
            searchHeader.category.parent
              ? "- " + searchHeader.category.parent.name
              : ""
          }}
          {{ searchQuery !== null ? "- " + searchQuery : "" }}
        </h1>
      </template>
      <template v-else>
        <h1>
          {{ searchHeader.category.name }}
          {{
            searchHeader.category.parent
              ? "- " + searchHeader.category.parent.name
              : ""
          }}
          {{ searchQuery !== null ? "- " + searchQuery : "" }}
        </h1>
      </template>
    </div>
  </div>
</template>

<script>
import SearchState from "@/views/Search/SearchState";
import jsonLd from "@/components/jsonLd.vue";
import okTextLoader from "@/components/uiKit/loader/okTextLoader";
import BuildUrl from "build-url";
import defaults from "lodash/defaults";
import pickBy from "lodash/pickBy";
import toPlainObject from "lodash/toPlainObject";
import env from "@/utils/env.js";
import isEmpty from "lodash/isEmpty";

export default {
  components: { jsonLd, okTextLoader },

  props: {
    search: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasSuggested: {
      type: Boolean,
      required: true
    },
    regions: {
      type: String,
      defaults: null
    },
    cities: {
      type: String,
      defaults: null
    }
  },
  computed: {
    jsonld() {
      if (!this.searchHeader) return null;
      var elements = [];
      var categories = [];
      if (
        this.searchHeader.category.parentTree &&
        this.searchHeader.category.parentTree.length > 0
      ) {
        if (this.searchHeader.category.parentTree[1]) {
          categories[0] = this.searchHeader.category.parentTree[0];
          categories[1] = this.searchHeader.category.parentTree[1];
          categories[2] = this.searchHeader.category;
        } else {
          categories[0] = this.searchHeader.category.parentTree[0];
          categories[1] = this.searchHeader.category;
        }
      } else {
        categories[0] = this.searchHeader.category;
      }
      for (let i = 0; i < 3; i++) {
        if (!isEmpty(categories[i])) {
          elements[i] = {
            position: i + 1,
            name: categories[i].name,
            item: BuildUrl(env.VUE_APP_OUEDKNISS_PORTAL, {
              path: this.$router.resolve({
                name: "search_category",
                params: { category: categories[i].slug, page: 1 }
              }).href
            })
          };
        }
      }
      return {
        itemListElement: elements
      };
    },
    searchHeader() {
      return SearchState;
    },
    searchQuery() {
      const queriesToKeep = [
        "marque-voiture",
        "modele",
        "nom_special",
        "annee"
      ];

      const queryString = defaults(toPlainObject(this.$route.query), {});

      const model = pickBy(queryString, (value, key) => {
        if (!queriesToKeep.includes(key)) return false;
        return true;
      });

      if (model["marque-voiture"]) {
        const marques = model["marque-voiture"].split("-");

        model["marque-voiture"] = marques
          .map(marque => {
            return marque[0].toUpperCase() + marque.substring(1);
          })
          .join(" ");
      }

      if (model["modele"]) {
        const models = model["modele"].split("-");

        model["modele"] = models
          .map(modele => {
            return modele[0].toUpperCase() + modele.substring(1);
          })
          .join(" ");
      }

      if (model["nom_special"]) {
        const specials = model["nom_special"].split("-");

        model["nom_special"] = specials
          .map(special => {
            return special[0].toUpperCase() + special.substring(1);
          })
          .join(" ");
      }

      const codenameToKeep = model["nom_special"]
        ? model["nom_special"]
        : model["modele"]
        ? model["modele"]
        : model["marque-voiture"]
        ? model["marque-voiture"]
        : "";

      if (model["annee"]) {
        const years = model["annee"].split("-");
        model["annee"] =
          years[0] === years[1]
            ? years[0]
            : years[0] === "null" && years[1] !== "null"
            ? years[1]
            : years[0] !== "null" && years[1] === "null"
            ? years[0]
            : model["annee"];
      }
      const finalcodename = model["annee"]
        ? codenameToKeep.replace(/  +/g, " ").trim() + " " + model["annee"]
        : codenameToKeep.replace(/  +/g, " ").trim();
      const finalTitle =
        this.regions && this.cities
          ? this.regions + " - " + this.cities
          : this.regions && !this.cities
          ? this.regions
          : null;

      return finalcodename && finalTitle
        ? finalcodename + " - " + finalTitle
        : finalTitle
        ? finalTitle
        : finalcodename
        ? finalcodename
        : null;
    }
  }
};
</script>

<style lang="scss">
.search-header {
  height: 40px;

  h1,
  .h1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.15em;
  }
}
.hr-border {
  border: 1px solid #e5e5e5;
}
.v-theme--light .search-header {
  border-bottom: 2px solid #e5e5e5;
}

.v-theme--dark .search-header {
  border-bottom: 2px solid #333;
}
</style>
