import type { MetalSymbol } from "@/lib/price-calculator";

export type PreciousMetalInfo = {
  /** Внутренний ключ (Pt — платина в коде и БД) */
  id: MetalSymbol;
  /** Тикер для отображения (платина на бирже — Pl, не Pt) */
  displaySymbol: string;
  name: string;
  /** Номер в таблице Менделеева (не показываем для биржевого Pl) */
  atomicNumber?: number;
};

export const PRECIOUS_METALS: Record<MetalSymbol, PreciousMetalInfo> = {
  Au: { id: "Au", displaySymbol: "Au", atomicNumber: 79, name: "Золото" },
  Ag: { id: "Ag", displaySymbol: "Ag", atomicNumber: 47, name: "Серебро" },
  Pt: { id: "Pt", displaySymbol: "Pl", name: "Платина" },
  Pd: { id: "Pd", displaySymbol: "Pd", atomicNumber: 46, name: "Палладий" },
};

export const PRECIOUS_METAL_LIST: PreciousMetalInfo[] = [
  PRECIOUS_METALS.Au,
  PRECIOUS_METALS.Ag,
  PRECIOUS_METALS.Pt,
  PRECIOUS_METALS.Pd,
];

export function getMetalDisplaySymbol(metal: MetalSymbol): string {
  return PRECIOUS_METALS[metal].displaySymbol;
}

export function getMetalLabel(metal: MetalSymbol): string {
  const info = PRECIOUS_METALS[metal];
  return `${info.displaySymbol} (${info.name})`;
}
