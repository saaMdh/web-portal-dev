import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { fr, arDZ } from "date-fns/locale";

const locales = { fr, ar: arDZ };

function formatDate(str) {
  if (typeof str === "string") str = parseISO(str);
  return format(str, "dd/MM/yyyy");
}

function formatDateTime(str) {
  if (typeof str === "string") str = parseISO(str);
  return format(str, "dd/MM/yyyy HH:mm:ss");
}

function formatDateTimeNow(str, locale) {
  if (typeof str === "string") str = parseISO(str);
  return formatDistanceToNow(str, { addSuffix: true, locale });
}

export default {
  methods: {
    formatDate,
    formatDateTime,
    formatDateTimeNow(str) {
      return formatDateTimeNow(str, locales[this.$i18n.locale]);
    }
  }
};
