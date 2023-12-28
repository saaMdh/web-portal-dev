import { Field, Form, defineRule, configure } from "vee-validate";

import {
  required,
  min,
  max,
  email,
  alpha_dash,
  max_value
} from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
const { locale } = useAuthFrame();

const alpha_specs = value => {
  const regex =
    /^([a-zA-Z0-9\u0621-\u064A\s0-9])[a-zA-Z0-9.@_\- \u0621-\u064A\s0-9]+$/gis;
  return !!regex.test(String(value));
};

defineRule("min_value", (value, { min }) => {
  return value >= min;
});

defineRule("required", required);
defineRule("min", min);
defineRule("max", max);
defineRule("phone", data => {
  var regex = /^(((\+213)|(00213)|0)(((7|6|5|9)[0-9]{8})|(2|3|4)[0-9]{7}))$/;
  return regex.test(data);
});
defineRule("year", v => /^[0-9]{4}$/.test(v));
defineRule("email", email);
defineRule("float", v => /^\d*(\.\d{0,2})?$/.test(v));
defineRule("alpha_dash", alpha_dash);
defineRule("alpha_specs", alpha_specs);

defineRule("confirmed", (value, [target]) => {
  if (value === target) {
    return true;
  }
  return false;
});

defineRule("validatePhone", data => {
  var regex = /^(((\+213)|(00213)|0)(((7|6|5|9)[0-9]{8})|(2|3|4)[0-9]{7}))$/;
  return regex.test(data);
});
defineRule("checkoutPhone", v => v && v.length > 0);
defineRule("checkout.max_qty", max_value);

configure({
  generateMessage: localize({
    fr: {
      messages: {
        required: "Ce champs est requis !",
        confirmed: "Les mots de passe doivent correspondre !",
        phone: "Un format de numéro valide est requis !",
        min: "Ce champ doit contenir au minimum {length} caractères",
        max: "Ce champ ne peut pas contenir plus de {length} caractères",
        email: "Ce champ doit être une adresse E-Mail valide.",
        year: "Un format d'année valide est requis !",
        float: "Le montant doit contenir 2 chiffres aprés la virgule",
        min_value: "Valeur minimum {min}",
        alpha_dash: "Le format n'est pas correct !",
        alpha_specs:
          "Seuls les chiffres, lettres et certains caractères spéciaux sont autorisés (\\ - . @ _) ",
        checkoutPhone: "Au moins un numéro doit être sélectionné",
        "checkout.max_qty": "Cette quantité n'est pas disponible"
      }
    },
    ar: {
      messages: {
        required: "يُرجى ملء هذه الخانة !",
        confirmed: "يجب أن تتطابق كلمات المرور !",
        phone: "الرقم غير صحيح !",
        min: "يجب أن تحتوي هذه الخانة على {length} أحرف على الأقل ",
        max: "يجب أن تحتوي هذه الخانة على {length} أحرف على الأكثر ",
        email: "يجب إدخال عنوان بريد إلكتروني صحيح في هذه الخانة.",
        year: "مطلوب لإدخال التاريخ صحيح !",
        float: "يجب أن يحتوي المبلغ على رقمين بعد العلامة العشرية",
        alpha_dash: "الصيغة ليست صحيحة!",
        alpha_specs:
          "مسموح فقط بالأرقام والأحرف وبعض الأحرف الخاصة (\\ -. @ _)",
        checkoutPhone: "يرجى اختيار رقم واحد على الأقل",
        "checkout.max_qty": "هذه الكمية غير متوفرة"
      }
    },
    en: {
      messages: {
        required: "This field is required !",
        confirmed: "Passwords must match !",
        phone: "A valid number format is required!",
        min: "This field must contain at least {length} characters",
        max: "This field cannot contain more than {length} characters",
        email: "This field must be a valid E-Mail address.",
        year: "A valid year format is required !",
        float: "The amount must contain 2 digits after the decimal point",
        alpha_dash: "The format is not correct!",
        alpha_specs:
          "Only numbers, letters and some special characters are allowed (\\ - . @ _)",
        checkoutPhone: "At least one number must be selected",
        "checkout.max_qty": "This quantity is not available"
      }
    }
  })
});
setLocale(locale.value);

export function LoadVeeComponent(app) {
  app.component("VvForm", Form);
  app.component("VvField", Field);
}
