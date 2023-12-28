require("core-js/stable");
require("whatwg-fetch");
require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
require("intersection-observer");
import "resize-observer-polyfill/dist/ResizeObserver.global";
const proxyPolyfill = require("proxy-polyfill/src/proxy")();
if (typeof Proxy === "undefined") {
  window.Proxy = proxyPolyfill;
}

if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}
require("./main");
