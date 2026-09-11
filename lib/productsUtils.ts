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

const getProductPrice = (product: Record<string, any>) => {
  const directPrice = product.price;
  if (directPrice !== null && directPrice !== undefined && directPrice !== '') {
    return Number(String(directPrice).replace(/,/g, '')) || 0;
  }

  const firstVariantPrice = product.variants?.[0]?.price;
  return Number(String(firstVariantPrice ?? '').replace(/,/g, '')) || 0;
};

const formatDisplayPrices = (price: number) => ({
  ar: price > 0 ? `${new Intl.NumberFormat('ar-EG').format(price)} ج.م` : 'السعر عند الطلب',
  en: price > 0 ? `${new Intl.NumberFormat('en-US').format(price)} EGP` : 'Price on request',
});

export function getCleanProducts(rawProducts: any[]): CleanProduct[] {
  return rawProducts.map((rawProduct) => {
    const product = { ...rawProduct };
    const searchText = [product.name, product.title].map(normalizeText).join(' ');
    const subCategoryId = normalizeText(product.subCategoryId);
    const displayPrices = formatDisplayPrices(getProductPrice(product));

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
      variants: Array.isArray(product.variants) ? product.variants.map((variant: any) => ({ ...variant })) : product.variants,
    };
  });
}
