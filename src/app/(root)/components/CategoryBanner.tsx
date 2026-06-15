import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import {
  type CategoryBannerConfig,
  type CategoryBannerTheme,
  getBannerAlignClasses,
  getBannerThemeStyle,
  resolveCategoryBannerContent,
} from "@/lib/category-banner";

export interface CategoryBannersProps {
  categoryName: string;
  categorySlug: string;
  warningMessage?: string | null;
  banner: CategoryBannerConfig;
  bannerTextLegacy?: string | null;
  showGuideBanner: boolean;
}

interface BannerBlockProps {
  title?: string | null;
  text: string;
  theme: CategoryBannerTheme;
  align: CategoryBannerConfig["align"];
  imageUrl?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
  showNoticeIcon?: boolean;
}

function CategoryBannerBlock({
  title,
  text,
  theme,
  align,
  imageUrl,
  linkUrl,
  linkLabel,
  showNoticeIcon,
}: BannerBlockProps) {
  const hasImage = theme === "IMAGE" && !!imageUrl;
  const styles = getBannerThemeStyle(theme, hasImage);
  const alignClasses = getBannerAlignClasses(align);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 ${styles.shell}`}
    >
      {hasImage && imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className={`absolute inset-0 ${styles.overlay}`} />
        </>
      )}

      <div
        className={`relative z-10 flex w-full flex-col gap-3 ${alignClasses.outer} ${alignClasses.text}`}
      >
        {showNoticeIcon && theme === "NOTICE" && (
          <div
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon} ${alignClasses.icon}`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}

        {title && (
          <p
            className={`text-base md:text-lg font-bold leading-snug ${styles.title}`}
          >
            {title}
          </p>
        )}

        <p
          className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap ${styles.text} ${
            title ? "" : "font-medium"
          }`}
        >
          {text}
        </p>

        {linkUrl && linkLabel && (
          <a
            href={linkUrl}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${styles.cta} ${alignClasses.cta}`}
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export function CategoryBanners({
  categoryName,
  categorySlug,
  warningMessage,
  banner,
  bannerTextLegacy,
  showGuideBanner,
}: CategoryBannersProps) {
  const content = resolveCategoryBannerContent(
    warningMessage,
    banner.title,
    bannerTextLegacy,
  );

  const showGuide =
    showGuideBanner && banner.showGuide && categorySlug !== "preview";

  if (!content && !showGuide) {
    return null;
  }

  return (
    <div className="mb-6 space-y-2">
      {content && (
        <CategoryBannerBlock
          title={content.title}
          text={content.text}
          theme={banner.theme}
          align={banner.align}
          imageUrl={banner.imageUrl}
          linkUrl={banner.linkUrl?.trim() || null}
          linkLabel={banner.linkLabel?.trim() || null}
          showNoticeIcon
        />
      )}

      {showGuide && (
        <Link
          href={`/catalog/${categorySlug}/guide`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] hover:underline"
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          Справочник: {categoryName}
        </Link>
      )}
    </div>
  );
}

/** @deprecated Используйте CategoryBanners */
export function CategoryBanner(props: CategoryBannersProps) {
  return <CategoryBanners {...props} />;
}
