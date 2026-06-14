import Link from "next/link";
import { CircuitBoard, BookOpen, ChevronRight } from "lucide-react";

interface CategoryBannerProps {
  categoryName: string;
  categorySlug: string;
  showBoardBanner: boolean;
  showGuideBanner: boolean;
}

export function CategoryBanner({
  categoryName,
  categorySlug,
  showBoardBanner,
  showGuideBanner,
}: CategoryBannerProps) {
  if (!showBoardBanner && !showGuideBanner) {
    return null;
  }

  const bothActive = showBoardBanner && showGuideBanner;

  return (
    <div className="mb-6 rounded-xl border border-[var(--primary-200)] bg-white shadow-sm overflow-hidden">
      {showBoardBanner && (
        <div
          className={`flex items-start gap-3 px-4 py-4 md:px-5 md:py-5 ${
            bothActive
              ? "bg-[var(--primary-50)] border-b border-[var(--primary-100)]"
              : "bg-[var(--primary-50)]"
          }`}
        >
          <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--primary-100)] flex items-center justify-center">
            <CircuitBoard className="w-5 h-5 text-[var(--primary-600)]" />
          </div>
          <p className="text-sm md:text-base text-[var(--primary-900)] font-medium leading-relaxed">
            Принимаем радиодетали на платах, цена от этого не меняется.
          </p>
        </div>
      )}

      {showGuideBanner && (
        <Link
          href={`/catalog/${categorySlug}/guide`}
          className={`group flex items-center justify-between gap-3 px-4 py-4 md:px-5 md:py-5 transition-colors ${
            bothActive
              ? "bg-white hover:bg-[var(--accent-50)]"
              : "bg-[var(--accent-50)] hover:bg-[var(--accent-100)]"
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-100)] flex items-center justify-center group-hover:bg-[var(--accent-200)] transition-colors">
              <BookOpen className="w-5 h-5 text-[var(--accent-600)]" />
            </div>
            <p className="text-sm md:text-base text-[var(--gray-800)] group-hover:text-[var(--primary-700)] transition-colors leading-relaxed">
              Информация о категории «{categoryName}» — перейдите в справочник{" "}
              <span className="text-[var(--accent-600)]">➔</span>
            </p>
          </div>
          <ChevronRight
            className="w-5 h-5 shrink-0 text-[var(--gray-400)] group-hover:text-[var(--accent-500)] group-hover:translate-x-0.5 transition-all"
          />
        </Link>
      )}
    </div>
  );
}
