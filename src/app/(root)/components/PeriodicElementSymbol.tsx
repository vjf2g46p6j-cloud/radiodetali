import type { MetalSymbol } from "@/lib/price-calculator";
import { PRECIOUS_METALS } from "@/lib/precious-metals";

interface PeriodicElementSymbolProps {
  metal: MetalSymbol;
  className?: string;
}

/** Тикер металла (биржевое обозначение: платина — Pl) */
export function PeriodicElementSymbol({
  metal,
  className = "",
}: PeriodicElementSymbolProps) {
  const element = PRECIOUS_METALS[metal];

  return (
    <span
      className={`inline-flex flex-col items-center justify-center leading-none font-semibold ${className}`}
      title={element.name}
    >
      {element.atomicNumber !== undefined && (
        <span className="text-[0.58em] font-medium opacity-75 tabular-nums">
          {element.atomicNumber}
        </span>
      )}
      <span className="text-[1em] tracking-tight">{element.displaySymbol}</span>
    </span>
  );
}
