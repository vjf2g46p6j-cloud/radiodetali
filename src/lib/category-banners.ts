import fs from "fs";
import path from "path";

const GUIDES_DIR = path.join(process.cwd(), "content", "category-guides");

/**
 * Баннер «приём на платах» — по умолчанию для всех категорий с товарами.
 * При необходимости можно ограничить список slug в BOARD_BANNER_SLUGS.
 */
const BOARD_BANNER_SLUGS: string[] = [];

export function showBoardBanner(slug: string, productCount: number): boolean {
  if (productCount <= 0) return false;
  if (BOARD_BANNER_SLUGS.length > 0) {
    return BOARD_BANNER_SLUGS.includes(slug);
  }
  return true;
}

/**
 * Баннер справочника — если для категории есть файл content/category-guides/{slug}.md
 */
export function showGuideBanner(slug: string): boolean {
  try {
    return fs.existsSync(path.join(GUIDES_DIR, `${slug}.md`));
  } catch {
    return false;
  }
}

export function getCategoryGuideContent(slug: string): string | null {
  try {
    const filePath = path.join(GUIDES_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/** Slug категорий, для которых есть файл справочника */
export function listCategoryGuideSlugs(): string[] {
  try {
    if (!fs.existsSync(GUIDES_DIR)) return [];
    return fs
      .readdirSync(GUIDES_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}
