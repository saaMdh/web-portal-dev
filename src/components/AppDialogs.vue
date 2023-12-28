<template>
  <div>
    <template v-if="render">
      <status-dialog></status-dialog>
      <call-dialog></call-dialog>
      <cart-dialog></cart-dialog>
      <message-box ref="messageBox"></message-box>
      <connexion-dialog v-if="!token"></connexion-dialog>
      <comment-dialog v-if="token"></comment-dialog>
    </template>

    <validation-dialog v-if="user && !user.isValidated"></validation-dialog>

    <template v-if="$isMobile">
      <lazy render-on-idle>
        <bookmark-dialog></bookmark-dialog>
      </lazy>
      <lazy render-on-idle>
        <search-dialog></search-dialog>
      </lazy>
      <lazy render-on-idle>
        <categories-dialog
          @applywithdelivery="cat => applywithdelivery(cat)"
        ></categories-dialog>
      </lazy>
    </template>
    <lazy :key="InterstitialKey" render-on-idle>
      <promo-interstitial v-bind="bindInterstitial"></promo-interstitial>
    </lazy>
    <lazy :key="FlashKey" render-on-idle>
      <promo-flash v-bind="bindFlash"></promo-flash>
    </lazy>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { nextTick } from "vue";
import omit from "lodash/omit";
import get from "lodash/get";
import { rand_key } from "@/utils/key";
function onIdle(cb = () => {}) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(() => {
      nextTick(cb);
    }, 2000);
  }
}
export default {
  components: {
    MessageBox: defineAsyncComponent(() =>
      import("@/components/Dialog/MessageBox.vue")
    ),
    CartDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/CartDialog.vue")
    ),

    ConnexionDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/ConnexionDialog.vue")
    ),

    StatusDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/StatusDialog.vue")
    ),

    CommentDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/CommentDialog.vue")
    ),

    CallDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/CallDialog.vue")
    ),

    ValidationDialog: defineAsyncComponent(() =>
      import("@/components/Announcement/Dialog/ValidationDialog.vue")
    ),
    SearchDialog: defineAsyncComponent(() =>
      import("@/components/Dialog/SearchDialog.vue")
    ),
    CategoriesDialog: defineAsyncComponent(() =>
      import("@/components/Dialog/CategoriesDialog.vue")
    ),
    BookmarkDialog: defineAsyncComponent(() =>
      import("@/components/Dialog/BookmarkDialog.vue")
    ),
    PromoInterstitial: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoInterstitial.vue")
    ),
    PromoFlash: defineAsyncComponent(() =>
      import("@/components/Promotion/PromoFlash.vue")
    )
  },
  props: {
    token: {
      type: String,
      default: null
    },
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      render: false
    };
  },
  computed: {
    bindInterstitial() {
      return omit(this.$store.state.dialog.bindInterstitial, ["key"]);
    },
    bindFlash() {
      return omit(this.$store.state.dialog.bindFlash, ["key"]);
    },
    InterstitialKey() {
      return get(this.$store.state.dialog.bindInterstitial, "key", rand_key());
    },
    FlashKey() {
      return get(this.$store.state.dialog.bindFlash, "key", rand_key());
    }
  },
  created() {
    onIdle(() => {
      this.render = true;
    });
  },
  methods: {
    applywithdelivery(cat) {
      if (
        this.$route.name !== "search" &&
        this.$route.name !== "searchP" &&
        this.$route.name !== "search_category"
      ) {
        this.$router.push({
          name: "search_category",
          params: { category: cat.slug, page: 1 },
          query: { delivery: "DELIVERY_AVAILABLE" }
        });
      } else {
        this.deliveryCategory = cat;
      }
    },
    openMessageBox(props) {
      return this.$refs.messageBox.open(props);
    }
  }
};
</script>

<style></style>
