import { NextResponse } from 'next/server';
import { fallbackCatalog, type CatalogPayload } from '@/lib/catalog';
import { importedCatalog } from '@/lib/imported-catalog';

const getSupabaseRows = async (table: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`Supabase ${table} query failed`);
  return response.json();
};

export async function GET() {
  try {
    const [categories, subCategories, brands, products, variants] = await Promise.all([
      getSupabaseRows('catalog_categories'),
      getSupabaseRows('catalog_sub_categories'),
      getSupabaseRows('catalog_brands'),
      getSupabaseRows('catalog_products'),
      getSupabaseRows('catalog_product_variants'),
    ]);

    if (categories?.length && subCategories?.length && brands?.length && products?.length && variants?.length) {
      const catalog: CatalogPayload = {
        categories: categories.map((item: any) => ({ id: item.id, name: item.name, icon: item.icon || 'category' })),
        subCategories: subCategories.map((item: any) => ({ id: item.id, categoryId: item.category_id, name: item.name })),
        brands: brands.map((item: any) => ({ id: item.id, name: item.name, logoUrl: item.logo_url || '' })),
        products: products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          imageUrl: item.image_url || '',
          brandId: item.brand_id,
          categoryId: item.category_id,
          subCategoryId: item.sub_category_id,
          variants: variants.filter((variant: any) => variant.product_id === item.id).map((variant: any) => ({ id: variant.id, label: variant.label, price: Number(variant.price) })),
        })).filter((item: any) => item.variants.length > 0),
      };
      return NextResponse.json(catalog);
    }
  } catch (error) {
    console.warn('Catalog database unavailable; using seed catalog.', error);
  }

  return NextResponse.json(importedCatalog.products.length ? importedCatalog : fallbackCatalog);
}
