import isArray from "lodash/isArray";
import isString from "lodash/isString";
import reduce from "lodash/reduce";
import take from "lodash/take";
import times from "lodash/times";
import map from "lodash/map";
import defaults from "lodash/defaults";

export function classArrayToObject(className) {
  return reduce(className, (acc, cur) => ({ ...acc, [cur]: true }), {});
}

export function classFormatValue(className) {
  if (isString(className)) return classArrayToObject(className.split(" "));
  if (isArray(className)) return classArrayToObject(className);
  return className;
}
export function intervertArray(array, from, to) {
  if (from === to) return;

  const takes = array.splice(from, 1);
  array.splice(to, 0, takes[0]);
}
export function clampValue(value, min, max) {
  return Math.max(Math.min(value, max), min);
}
export function ensureItemsCount(list, count, generator) {
  if (list.length > count) {
    list = take(list, count);
  } else {
    list = [
      ...list,
      ...times(count - list.length, i => generator(list.length + i))
    ];
  }

  list = map(list, (item, i) => defaults(item, generator(i)));

  return list;
}

export function groupeItems(list, n) {
  const arrayOfArrays = [];

  for (let i = 0; i < list.length; i += n) {
    arrayOfArrays.push(list.slice(i, i + n));
  }

  return arrayOfArrays;
}

export function GenerateArrayListStep(n) {
  return Array.from({ length: n }, () => []);
}
