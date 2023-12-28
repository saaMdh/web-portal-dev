import { computed, ref } from "vue";
import { useLocal } from "@/composables/hooks/useLocalStorage";
import { OK_ACT_HIST_DEFAULT_SCHEMA } from "@/schema/search";
/**
 * App default composable for search history
 */
const { actionHistory } = useLocal(
  "ok-act-hist",
  OK_ACT_HIST_DEFAULT_SCHEMA,
  "actionHistory"
);
/**
 * Threshold of local storage usage for search history
 */
const MAX_RECENT_SEARCHES_COUNT = 12;

export default {
  setup() {
    const { recentSearches } = actionHistory;
    const recentSearchesLimit = ref(MAX_RECENT_SEARCHES_COUNT);
    const shortenedRecentSearches = computed(() =>
      recentSearches.value.slice(0, recentSearchesLimit.value)
    );
    return {
      recentSearches,
      shortenedRecentSearches,
      recentSearchesLimit
    };
  },
  methods: {
    logSearch(query) {
      if (!query || !this.recentSearches) return;
      let tokened = (query || "").unslugify();

      let copy = this.recentSearches.filter(el => el.text !== tokened);
      copy.unshift({ text: tokened });
      if (copy.length > MAX_RECENT_SEARCHES_COUNT) {
        copy = copy.slice(0, MAX_RECENT_SEARCHES_COUNT);
      }
      this.recentSearches = copy;
    }
  }
};
