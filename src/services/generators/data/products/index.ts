import type { LanguageCode } from '../../../../schema/data-types.js';
import type { ProductCategory } from '../../../../schema/fields/product-field.js';

import { PRODUCTS_EN } from './en.js';
import { PRODUCTS_TR } from './tr.js';


export interface Product {
  name: string;
  category: ProductCategory;
  lang: LanguageCode;
}

export function getProductsByCategory(
  category: ProductCategory | ProductCategory[],
  lang?: LanguageCode
): string[] {
  const products = lang === 'tr' ? PRODUCTS_TR : PRODUCTS_EN;

  if (Array.isArray(category)) {
    const result: string[] = [];
    for (const cat of category) {
      result.push(...products[cat]);
    }
    return result;
  }

  return products[category];
}

export function getRandomProduct(
  categories?: ProductCategory[],
  lang?: LanguageCode
): string {
  const products = lang === 'tr' ? PRODUCTS_TR : PRODUCTS_EN;

  if (categories && categories.length > 0) {
    const availableProducts = getProductsByCategory(categories, lang);
    return (
      availableProducts[Math.floor(Math.random() * availableProducts.length)] ??
      'Product'
    );
  }

  // Random category if none specified
  const allCategories = Object.keys(products) as ProductCategory[];
  const randomCategory =
    allCategories[Math.floor(Math.random() * allCategories.length)];
  const categoryProducts = products[randomCategory!];

  return (
    categoryProducts[Math.floor(Math.random() * categoryProducts.length)] ??
    'Product'
  );
}

export const ALL_CATEGORIES: ProductCategory[] = [
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
  'toys',
  'food',
  'beauty',
  'automotive',
  'garden',
];
