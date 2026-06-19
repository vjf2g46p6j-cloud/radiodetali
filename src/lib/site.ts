import type { SellModalContactInfo } from "@/app/(root)/components/SellModal";

/** Единое написание бренда на сайте и в SEO */
export const SITE_BRAND = "ДРАГСОЮЗ";

export function formatPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function formatTelegramHref(username: string): string {
  const cleanUsername = username
    .replace(/^@/, "")
    .replace(/^https?:\/\/t\.me\//, "");
  return `https://t.me/${cleanUsername}`;
}

export function buildSellContactInfo(
  settings?: {
    phoneNumber?: string | null;
    telegramUsername?: string | null;
    vkLink?: string | null;
  } | null,
): SellModalContactInfo {
  const phoneNumber = settings?.phoneNumber || "+7 (812) 983-49-76";
  const phoneDigits = (settings?.phoneNumber || "+78129834976").replace(
    /[^\d+]/g,
    "",
  );

  return {
    phoneNumber,
    phoneHref: formatPhoneHref(phoneDigits),
    telegramHref: formatTelegramHref(settings?.telegramUsername || "dragsoyuz"),
    vkHref: settings?.vkLink || "https://vk.com/dragsoyuz",
  };
}
