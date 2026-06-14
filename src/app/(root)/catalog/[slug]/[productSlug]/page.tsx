export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getProductBySlug,
  getProducts,
  getCategoryBySlug,
  getGlobalSettings,
} from "@/app/actions";
import { ProductCard, ProductGridSkeleton } from "../../../components";
import { ProductDetailView } from "../../../components/ProductDetailView";
import type { SellModalContactInfo } from "../../../components";

interface ProductPageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://драгсоюз.рф";

function getDisplayPrice(product: {
  priceNew: number | null;
  priceUsed: number | null;
}): number {
  return product.priceNew ?? product.priceUsed ?? 0;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug: categorySlug, productSlug } = await params;
  const result = await getProductBySlug(productSlug);

  if (!result.success) {
    return {
      title: "Товар не найден",
    };
  }

  const product = result.data;
  const canonicalUrl = `${BASE_URL}/catalog/${categorySlug}/${productSlug}`;
  const seoName = product.seoH1 || product.name;
  const autoDescription = `Сдать ${seoName} по высоким ценам в Санкт-Петербурге. Скупаем в любых объемах. Оценка по фото в мессенджере, оплата сразу, честное взвешивание. Компания ДрагСоюз в СПб. Звоните +7 (921)-632-01-05`;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`
    : undefined;

  return {
    title: {
      absolute: `Скупаем ${seoName} по высоким ценам в Санкт-Петербурге | Любые объемы, честное взвешивание, оплата сразу | ДрагСоюз СПб`,
    },
    description: product.seoDescription || autoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Скупаем ${seoName} в Санкт-Петербурге | ДрагСоюз СПб`,
      description:
        product.seoDescription ||
        `Сдать ${seoName} дорого в СПб. Оценка по фото, оплата сразу.`,
      type: "website",
      url: canonicalUrl,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
    },
  };
}

interface ProductSchemaProps {
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  categorySlug: string;
  productSlug: string;
}

function ProductSchema({
  name,
  description,
  image,
  price,
  categorySlug,
  productSlug,
}: ProductSchemaProps) {
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}${image}`
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description && { description }),
    ...(imageUrl && { image: imageUrl }),
    url: `${BASE_URL}/catalog/${categorySlug}/${productSlug}`,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  categoryName: string;
  categorySlug: string;
  productName: string;
  productSlug: string;
}

function BreadcrumbSchema({
  categoryName,
  categorySlug,
  productName,
  productSlug,
}: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Каталог",
        item: `${BASE_URL}/catalog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/catalog/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: productName,
        item: `${BASE_URL}/catalog/${categorySlug}/${productSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

async function RelatedProducts({
  categoryId,
  currentId,
  categorySlug,
}: {
  categoryId: string;
  currentId: string;
  categorySlug: string;
}) {
  const result = await getProducts({ categoryId, limit: 5 });

  if (!result.success) {
    return null;
  }

  const relatedProducts = result.data.filter((p) => p.id !== currentId);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-14 pt-8 border-t border-[var(--gray-200)]">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--gray-900)] mb-6">
        Похожие товары
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categorySlug={categorySlug}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug: categorySlug, productSlug } = await params;

  const categoryResult = await getCategoryBySlug(categorySlug);
  if (!categoryResult.success) {
    notFound();
  }
  const category = categoryResult.data;

  const result = await getProductBySlug(productSlug);
  if (!result.success) {
    notFound();
  }

  const product = result.data;
  const displayPrice = getDisplayPrice(product);

  const settingsResult = await getGlobalSettings();
  const settings = settingsResult.success ? settingsResult.data : null;
  const sellContactInfo: SellModalContactInfo | undefined = settings
    ? {
        phoneNumber: settings.phoneNumber || "+7 (812) 983-49-76",
        phoneHref: `tel:${(settings.phoneNumber || "+78129834976").replace(/[^\d+]/g, "")}`,
        telegramHref: `https://t.me/${(settings.telegramUsername || "dragsoyuz").replace(/^@/, "").replace(/^https?:\/\/t\.me\//, "")}`,
        vkHref: settings.vkLink || "https://vk.com/dragsoyuz",
      }
    : undefined;

  return (
    <>
      <ProductSchema
        name={product.seoH1 || product.name}
        description={product.description}
        image={product.image}
        price={displayPrice}
        categorySlug={categorySlug}
        productSlug={productSlug}
      />
      <BreadcrumbSchema
        categoryName={category.name}
        categorySlug={categorySlug}
        productName={product.name}
        productSlug={productSlug}
      />

      <div className="min-h-screen bg-[var(--gray-50)]">
        <div className="bg-white border-b border-[var(--gray-200)]">
          <div className="container mx-auto px-4 py-3">
            <nav
              className="flex items-center gap-2 text-sm text-[var(--gray-500)] overflow-x-auto"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/"
                className="hover:text-[var(--primary-600)] whitespace-nowrap"
              >
                Главная
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link
                href="/catalog"
                className="hover:text-[var(--primary-600)] whitespace-nowrap"
              >
                Каталог
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <Link
                href={`/catalog/${categorySlug}`}
                className="hover:text-[var(--primary-600)] whitespace-nowrap"
              >
                {category.name}
              </Link>
              <ChevronRight className="w-4 h-4 shrink-0" />
              <span className="text-[var(--gray-900)] font-medium truncate max-w-[12rem] sm:max-w-none">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
          <ProductDetailView
            product={product}
            categoryName={category.name}
            categorySlug={categorySlug}
            sellContactInfo={sellContactInfo}
          />

          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <RelatedProducts
              categoryId={product.categoryId}
              currentId={product.id}
              categorySlug={categorySlug}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
