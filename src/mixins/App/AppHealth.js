import sleep from "@/utils/Sleep";
import { IsBotAgent } from "@ouedkniss/web-ui-plugin/src/utils/Versioning";
import env from "@/utils/env.js";

export default {
  data() {
    return {
      health: {
        error: null,
        loading: 0
      },
      attemp: 0
    };
  },
  mounted() {
    if (!IsBotAgent()) this.checkHealth();
  },
  methods: {
    async checkHealth() {
      const healthCheck = new URL(env.VUE_APP_GRAPHQL_HTTP);
      healthCheck.pathname = "/health/ready";

      this.attemp++;
      try {
        const res = await fetch(healthCheck.href);
        if (res.status !== 200) throw new Error("Gateway Unreachable");
        this.health.error = false;
      } catch (error) {
        if (this.attemp < 5) {
          await sleep(1000);
          this.checkHealth();
        } else this.health.error = true;
      }
    }
  }
};
