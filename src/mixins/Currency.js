import currency from "currency.js";

function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function formatCurrency(value, formatWithSymbol = true) {
  return currency(value, {
    symbol: "DA",
    pattern: "# !",
    formatWithSymbol,
    separator: " ",
    decimal: ".",
    precision: isInt(value) ? 0 : 2
  })
    .format()
    .trim();
}

export default {
  methods: {
    formatCurrency,

    formatFollower(value) {
      if (value < 1000) return value;
      if (value > 1000 && value < 1000000)
        return `${Math.round(value / 1000)}k`;
      if (value > 1000000) return `${Math.round(value / 1000000)}m`;
    }
  }
};
