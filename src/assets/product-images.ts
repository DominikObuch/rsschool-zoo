import { AnimalSlug, type ProductImageSet } from '../types.ts';

const FALLBACK_ID = 1;

const productIdBySlug: Record<AnimalSlug, number> = {
  [AnimalSlug.Panda]: 1,
  [AnimalSlug.Eagle]: 2,
  [AnimalSlug.Gorilla]: 3,
  [AnimalSlug.Lemur]: 4,
};

const productImagesById: Record<number, ProductImageSet> = {
  1: {
    id: 1,
    main: '/images/products/1/main.png',
    profile: '/images/products/1/profile.png',
    thumbs: ['/images/products/1/thumb-1.png', '/images/products/1/thumb-2.png', '/images/products/1/thumb-3.png'],
  },
  2: {
    id: 2,
    main: '/images/products/2/main.png',
    profile: '/images/products/2/profile.png',
    thumbs: ['/images/products/2/thumb-1.png', '/images/products/2/thumb-2.png', '/images/products/2/thumb-3.png'],
  },
  3: {
    id: 3,
    main: '/images/products/3/main.png',
    profile: '/images/products/3/profile.png',
    thumbs: ['/images/products/3/thumb-1.png', '/images/products/3/thumb-2.png', '/images/products/3/thumb-3.png'],
  },
  4: {
    id: 4,
    main: '/images/products/4/main.png',
    profile: '/images/products/4/profile.png',
    thumbs: ['/images/products/4/thumb-1.png', '/images/products/4/thumb-2.png', '/images/products/4/thumb-3.png'],
  },
  // Manual additions for products not present in main design assets.
  5: {
    id: 5,
    main: '/images/products/5/main.png',
    profile: '/images/products/5/profile.png',
    thumbs: ['/images/products/5/thumb-1.png', '/images/products/5/thumb-2.png', '/images/products/5/thumb-3.png'],
  },
  6: {
    id: 6,
    main: '/images/products/6/main.png',
    profile: '/images/products/6/profile.png',
    thumbs: ['/images/products/6/thumb-1.png', '/images/products/6/thumb-2.png', '/images/products/6/thumb-3.png'],
  },
};

export function getProductImagesById(productId: number): ProductImageSet {
  return productImagesById[productId] ?? productImagesById[FALLBACK_ID];
}

export function getProductIdBySlug(slug: AnimalSlug): number {
  return productIdBySlug[slug] ?? FALLBACK_ID;
}

export function getProductImagesBySlug(slug: AnimalSlug): ProductImageSet {
  const productId = getProductIdBySlug(slug);
  return getProductImagesById(productId);
}

export { productImagesById, productIdBySlug };
