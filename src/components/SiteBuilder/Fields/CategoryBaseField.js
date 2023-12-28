import { mapGetters } from "vuex";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import filter from "lodash/filter";
import get from "lodash/get";
import env from "@/utils/env";
import gql from "graphql-tag";

const STORE_CATEGORIES = gql`
  query CategoryBaseField($id: ID!) {
    categories: storeAnnouncementCategoriesList(storeId: $id) {
      id
      name
      slug
      children {
        id
        name
        slug
        children {
          id
          name
          slug
        }
      }
    }
  }
`;

export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      categories: [],
      loading: 0
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const { data } = await this.$apollo.query({
          query: STORE_CATEGORIES,
          variables: { id: this.store.id }
        });
        let categories = get(data, "categories", []);
        categories = sortBy(categories, "name");
        categories = uniqBy(categories, "name");
        this.categories = filter(categories, c => c.children.length);
      } catch (error) {
        if (env.isDev) console.error(error);
      }
    }
  },
  watch: {
    store: {
      handler(val) {
        if (val && val.id) this.fetchCategories();
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({ store: "builder/store" })
  }
};
