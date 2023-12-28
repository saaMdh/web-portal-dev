import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import mergeWith from "lodash/mergeWith";
import reduce from "lodash/reduce";
import union from "lodash/union";
import filter from "lodash/filter";
import size from "lodash/size";
import toInteger from "lodash/toInteger";

export default {
  setup() {
    const { locale } = useAuthFrame();
    return { locale };
  },
  methods: {
    isArray: v => isArray(v),
    joinQuery(v) {
      let cluster = union(...map(v, q => q.cluster || []));
      cluster = [...cluster, ...filter(v, q => isEmpty(q.cluster))];

      let count = reduce(v, (accu, curr) => accu + curr.count, 0);
      count = toInteger(count / (size(cluster) || 1));

      const name = reduce(
        v,
        (accu, curr) =>
          mergeWith(
            accu,
            curr.name,
            (name1, name2) => name2 + (isEmpty(name1) ? "" : `, ${name1}`)
          ),
        {
          fr: "",
          ar: "",
          en: ""
        }
      );
      return {
        count,
        name,
        cluster
      };
    }
  }
};
