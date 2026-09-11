import type { CatalogProduct } from './catalog';

export type ProductCategory = {
  id: string;
  name: string;
  icon: string;
  nameAr: string;
  nameEn: string;
};

export type CleanProduct = CatalogProduct & {
  displayPrice: string;
  displayPriceAr: string;
  displayPriceEn: string;
};

export const CATEGORIES: ProductCategory[] = [
  { id: 'all', name: 'All', nameAr: 'الكل', nameEn: 'All', icon: 'apps' },
  { id: 'cctv', name: 'CCTV', nameAr: 'كاميرات المراقبة', nameEn: 'CCTV', icon: 'videocam' },
  { id: 'access', name: 'Access Control', nameAr: 'التحكم في الدخول', nameEn: 'Access Control', icon: 'admin_panel_settings' },
  { id: 'smart-locks', name: 'Smart Locks', nameAr: 'الأقفال الذكية', nameEn: 'Smart Locks', icon: 'lock' },
  { id: 'intercom', name: 'Intercom Systems', nameAr: 'أنظمة الإنتركم', nameEn: 'Intercom Systems', icon: 'doorbell' },
  { id: 'smart-panels', name: 'Smart Panels', nameAr: 'لوحات وشاشات التحكم', nameEn: 'Smart Panels', icon: 'dashboard' },
  { id: 'smart-home', name: 'Smart Home', nameAr: 'البيت الذكي', nameEn: 'Smart Home', icon: 'home_iot_device' },
  { id: 'networking', name: 'Networking', nameAr: 'الشبكات', nameEn: 'Networking', icon: 'settings_ethernet' },
];

const LOCK_KEYWORDS = ['lock', 'قفل', 'bsh'];
const INTERCOM_KEYWORDS = ['intercom', 'ktp02', 'vth', 'vto', 'إنتركم'];
const SMART_PANEL_KEYWORDS = ['panel', 'touchscreen', 'elva', 'module', 'relay'];

const normalizeText = (value: unknown) => String(value ?? '').trim().toLowerCase();

const includesKeyword = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(normalizeText(keyword)));

const toPositivePrice = (value: unknown) => {
  const price = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(price) && price > 0 ? price : 0;
};

const getProductPrice = (product: Record<string, any>, variants = product.variants) => {
  const directPrice = product.price;
  if (directPrice !== null && directPrice !== undefined && directPrice !== '') {
    return toPositivePrice(directPrice);
  }

  return toPositivePrice(variants?.[0]?.price);
};

const formatDisplayPrices = (price: number) => ({
  ar: price > 0 ? `${new Intl.NumberFormat('ar-EG').format(price)} ج.م` : 'السعر عند الطلب',
  en: price > 0 ? `${new Intl.NumberFormat('en-US').format(price)} EGP` : 'Price on request',
});

export function getCleanProducts(rawProducts: any[]): CleanProduct[] {
  const seenProductKeys = new Set<string>();

  return rawProducts.flatMap((rawProduct) => {
    const product = { ...rawProduct };
    const pricedVariants = Array.isArray(product.variants)
      ? product.variants
        .map((variant: any) => ({ ...variant, price: toPositivePrice(variant.price) }))
        .filter((variant: any) => variant.price > 0)
      : [];
    const productPrice = getProductPrice(product, pricedVariants);
    if (productPrice <= 0 || pricedVariants.length === 0) return [];

    const productName = normalizeText(product.name || product.title);
    const productKey = productName
      ? `${normalizeText(product.brandId)}:${productName}`
      : normalizeText(product.id);
    if (!productKey || seenProductKeys.has(productKey)) return [];
    seenProductKeys.add(productKey);

    const searchText = [product.name, product.title].map(normalizeText).join(' ');
    const subCategoryId = normalizeText(product.subCategoryId);
    const displayPrices = formatDisplayPrices(productPrice);

    let categoryId = product.categoryId;
    if (includesKeyword(searchText, LOCK_KEYWORDS) || subCategoryId === 'locks') {
      categoryId = 'smart-locks';
    } else if (includesKeyword(searchText, INTERCOM_KEYWORDS)) {
      categoryId = 'intercom';
    } else if (includesKeyword(searchText, SMART_PANEL_KEYWORDS)) {
      categoryId = 'smart-panels';
    }

    return {
      ...product,
      categoryId,
      displayPrice: displayPrices.en,
      displayPriceAr: displayPrices.ar,
      displayPriceEn: displayPrices.en,
      variants: pricedVariants,
    };
  });
}
