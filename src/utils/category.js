import get from "lodash/get";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import env from "@/utils/env.js";

/**
 * @property {String} slug
 * @property {Array} categories
 * @property {Array} path
 */
export function getCategoryFromSlug(slug, categories, path) {
  try {
    if (!isString(slug))
      throw new Error(
        `Invalid argument: type check failed for argument "slug". Expected String`
      );
    if (!isArray(categories))
      throw new Error(
        `Invalid argument: type check failed for argument "categories". Expected Array`
      );
    if (!isArray(path))
      throw new Error(
        `Invalid argument: type check failed for argument "path". Expected Array`
      );

    if (!slug || categories.length === 0) return null;

    const category = categories.find(c => slug.includes(c.slug));
    if (category) path.push(category);
    if (get(category, "children", null)) {
      return getCategoryFromSlug(slug, category.children, path) || category;
    }
    return category;
  } catch (error) {
    if (env.isDev) console.error(error);
    return null;
  }
}
