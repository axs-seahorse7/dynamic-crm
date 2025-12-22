import * as Icons from "lucide-react";

export const SAFE_ICONS = Object.entries(Icons).filter(
  ([, Icon]) => typeof Icon === "function"
);
