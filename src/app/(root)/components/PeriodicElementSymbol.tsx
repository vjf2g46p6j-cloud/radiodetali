import type { MetalSymbol } from "@/lib/price-calculator";
import { PRECIOUS_METALS } from "@/lib/precious-metals";

interface PeriodicElementSymbolProps {
  metal: MetalSymbol;
  className?: string;
  showAtomicNumber?: boolean;
}

/** Символ элемента в стиле ячейки таблицы Менделеева */
export function PeriodicElementSymbol({
  metal,
  className = "",
  showAtomicNumber = true,
}: PeriodicElementSymbolProps) {
  const element = PRECIOUS_METALS[metal];

  return (
    <span
      className={`inline-flex flex-col items-center justify-center leading-none font-semibold ${className}`}
      title={`${element.name} (${element.atomicNumber})`}
    >
      {showAtomicNumber && (
        <span className="text-[0.58em] font-medium opacity-75 tabular-nums">
          {element.atomicNumber}
        </span>
      )}
      <span className="text-[1em] tracking-tight">{element.symbol}</span>
    </span>
  );
}
