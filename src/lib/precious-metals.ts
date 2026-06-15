import type { MetalSymbol } from "@/lib/price-calculator";

export type PreciousMetalInfo = {
  symbol: MetalSymbol;
  atomicNumber: number;
  name: string;
};

/** Драгметаллы: символы по таблице Менделеева (IUPAC) */
export const PRECIOUS_METALS: Record<MetalSymbol, PreciousMetalInfo> = {
  Au: { symbol: "Au", atomicNumber: 79, name: "Золото" },
  Ag: { symbol: "Ag", atomicNumber: 47, name: "Серебро" },
  Pt: { symbol: "Pt", atomicNumber: 78, name: "Платина" },
  Pd: { symbol: "Pd", atomicNumber: 46, name: "Палладий" },
};

export const PRECIOUS_METAL_LIST: PreciousMetalInfo[] = [
  PRECIOUS_METALS.Au,
  PRECIOUS_METALS.Ag,
  PRECIOUS_METALS.Pt,
  PRECIOUS_METALS.Pd,
];
