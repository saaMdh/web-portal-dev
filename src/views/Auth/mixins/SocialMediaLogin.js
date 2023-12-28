import { mapActions } from "vuex";

import initFirebase from "@/plugins/firebase";
export default {
  methods: {
    ...mapActions(["authWithProvider"]),

    async socialLogin(provider, platform) {
      const { cfaSignIn } = await import("capacitor-firebase-auth/alternative");
      if (platform !== "web") {
        return new Promise((resolve, reject) => {
          cfaSignIn(provider).subscribe(
            async result => {
              resolve(result.userCredential.user._lat);
            },
            error => {
              reject(error);
            }
          );
        });
      }
      sessionStorage.setItem("AuthWithRedirect", true);
      initFirebase()
        .then(firebase => {
          if (provider === "facebook.com") {
            var fprovider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithRedirect(fprovider);
          } else {
            let gProvider = new firebase.auth.GoogleAuthProvider();
            gProvider.addScope("email");
            gProvider.addScope("profile");
            firebase.auth().signInWithRedirect(gProvider);
          }
        })
        .catch(console.error);
    }
  }
};
