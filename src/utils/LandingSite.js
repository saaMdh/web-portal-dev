import { baseUrl } from "./location";

//const TYPES = ["store", "market"];

export function LandingType() {
  return baseUrl().includes("landing") ? "market" : "store";
}

export const LandingID = `${LandingType()}Id`;
export const LandingName = `${LandingType()}Name`;
