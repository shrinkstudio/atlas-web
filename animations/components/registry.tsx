import type { ComponentType } from "react";

import Home from "./animations/home";
import WorkHistory from "./animations/work-history";
import Documents from "./animations/documents";
import NeighborhoodNetwork from "./animations/neighborhood-network";
import FindContractor from "./animations/find-contractor";
import ClaimWork from "./animations/claim-work";
import Portfolio from "./animations/portfolio";
import GetFound from "./animations/get-found";
import Leads from "./animations/leads";
import YourStreet from "./animations/your-street";
import BlockEvents from "./animations/block-events";
import TownNotices from "./animations/town-notices";
import VerifiedNeighbors from "./animations/verified-neighbors";
import PropertyProfile from "./animations/property-profile";

// slug -> component. The slug is the URL path; "home" is served at "/".
// Embed URL for a card = https://<domain>/<slug>
export const animations: Record<string, ComponentType> = {
  "home": Home,
  "work-history": WorkHistory,
  "documents": Documents,
  "neighborhood-network": NeighborhoodNetwork,
  "find-contractor": FindContractor,
  "claim-work": ClaimWork,
  "portfolio": Portfolio,
  "get-found": GetFound,
  "leads": Leads,
  "your-street": YourStreet,
  "block-events": BlockEvents,
  "town-notices": TownNotices,
  "verified-neighbors": VerifiedNeighbors,
  "property-profile": PropertyProfile,
};
