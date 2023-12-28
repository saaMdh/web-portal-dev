import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default function () {
  const router = useRouter();
  const { t } = useI18n();

  function to(name, params) {
    let options = {
      name
    };
    if (params) options["params"] = params;

    router.push(options);
  }

  const links = [
    {
      label: t("footer.stores"),
      on: () => {
        window.location = "https://www.ouedkniss.com/store/19047/ouedkniss";
      }
    },

    {
      label: t("footer.ads"),
      on: () => {
        window.location = "https://www.ouedkniss.com/store/19047/ouedkniss";
      }
    },

    {
      label: t("footer.privacy"),
      on: () => to("privacy")
    },

    {
      label: t("footer.legals"),
      on: () => to("legals")
    },

    {
      label: t("footer.contact"),
      on: () => to("contactUs")
    },

    {
      label: t("footer.autobip"),
      on: () => window.open("https://www.autobip.com/", "_blank")
    }
  ];

  return links;
}
