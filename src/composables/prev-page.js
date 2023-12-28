import { ref } from "vue";

const PrevPage = ref(null);

export function usePrevPage() {
  return { page: PrevPage };
}
