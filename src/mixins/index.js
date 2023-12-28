import CurrencyMixin from "./Currency";
import VeeValidateMixin from "./vee-validate";
import DateMixin from "./Date";
import ResponsiveMixin from "./Responsive";
import PermissionMixin from "./Permission";
import RouterMixin from "./RouterMixin";
import { HeadOptions } from "@unhead/vue/vue2";

export function registerMixin(app) {
  app.mixin(DateMixin);
  app.mixin(RouterMixin);
  app.mixin(CurrencyMixin);
  app.mixin(VeeValidateMixin);
  app.mixin(ResponsiveMixin);
  app.mixin(PermissionMixin);
  app.mixin(HeadOptions);
}
