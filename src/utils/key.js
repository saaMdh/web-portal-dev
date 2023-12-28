// this function is used to make sure the component will never be cached
// use a unique key if available instead of this function.
export function rand_key() {
  return Math.floor(Math.random() * 1000000);
}
