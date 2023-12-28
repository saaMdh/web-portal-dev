import { LandingType } from "@/utils/LandingSite";
import BlockDefinitionStore from "@/components/SiteBuilder/Blocks/BlockDefinitions/BlockDefinitionStore";
import BlockDefinitionMarket from "@/components/SiteBuilder/Blocks/BlockDefinitions/BlockDefinitionMarket";

export default function() {
  return LandingType() === "market"
    ? BlockDefinitionMarket
    : BlockDefinitionStore;
}
