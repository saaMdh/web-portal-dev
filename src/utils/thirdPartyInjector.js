import env from "./env";
import sleep from "./Sleep";

export default () => {
  sleep(2500);
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src =
    "https://www.googletagmanager.com/gtag/js?id=" +
    env.VUE_APP_GOOGLE_ANALYTICS_4_KEY;
  head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", env.VUE_APP_GOOGLE_ANALYTICS_4_KEY);
  gtag("event", "app_version", {
    version: "<%= htmlWebpackPlugin.options.version %> - portal"
  });
  gtag("get", env.VUE_APP_GOOGLE_ANALYTICS_4_KEY, "client_id", function(
    client_id
  ) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * 3600 * 24 * 365 * 2;
    now.setTime(expireTime);
    document.cookie =
      "cid=" + client_id + ";expires=" + now.toUTCString() + ";path=/";
  });
  window.gtag = gtag;
  (function(G, o, O, g, L, e) {
    (G[g] =
      G[g] ||
      function() {
        (G[g]["q"] = G[g]["q"] || []).push(arguments);
      }),
      (G[g]["t"] = 1 * new Date());
    (L = o.createElement(O)), (e = o.getElementsByTagName(O)[0]);
    L.async = 1;
    L.defer = 1;
    L.id = 1;
    L.src = "https://www.google.com/adsense/search/async-ads.js";
    e.parentNode.insertBefore(L, e);
  })(window, document, "script", "_googCsa");

  !(function(f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.defer = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  window.fbq("init", "655958734553123");
};
