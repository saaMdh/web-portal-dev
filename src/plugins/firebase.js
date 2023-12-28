import env from "@/utils/env.js";

const initFirebase = async () => {
  const firebase = (await import("firebase/app")).default;
  await Promise.all([import("firebase/auth")]);

  var firebaseConfig = JSON.parse(
    Buffer.from(env.VUE_APP_FIREBASE_CONFIG, "base64").toString()
  );
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  if (global.firebase) {
    return global.firebase;
  }

  if (!firebase) {
    return Promise.reject(new Error("loading error"));
  }

  global.firebase = firebase;

  return global.firebase ? global.firebase : firebase;
};

export default initFirebase;
