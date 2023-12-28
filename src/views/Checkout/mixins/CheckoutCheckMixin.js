import find from "lodash/find";

export default {
  computed: {
    currentChunk() {
      return find(this.chunks, c => c.id == this.$route.query.chunkId);
    }
  },

  methods: {
    checkInvalidChunkId() {
      if (this.currentChunk === undefined) {
        this.$router.push({ name: "checkout_cart" });
      }
    },

    checkInvalidContactInfo() {
      if (!this.currentChunk.contact) {
        this.$router.push({
          name: "checkout_info",
          query: { chunkId: this.currentChunk.id }
        });
      }
    }
  }
};
