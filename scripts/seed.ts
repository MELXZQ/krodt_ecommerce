import path from 'node:path';
import fs from 'node:fs';
import { db } from '../src/lib/db';
import {
  products,
  productVariants,
  productImages,
  genders,
  sizes,
  colors,
  brands,
  categories,
  collections,
  productCollections,
} from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}


async function ensureStaticUploads() {
  const uploadsDir = path.join(process.cwd(), 'static', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const shoesSrc = path.join(process.cwd(), 'public', 'shoes');
  const exts = /\.(png|jpg|jpeg|webp|avif)$/i;
  const shoeFiles = fs.existsSync(shoesSrc)
    ? fs.readdirSync(shoesSrc).filter(f => exts.test(f)).sort((a, b) => a.localeCompare(b))
    : [];

  const copied: string[] = [];
  for (const f of shoeFiles) {
    const src = path.join(shoesSrc, f);
    const dest = path.join(uploadsDir, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
    copied.push(`/static/uploads/${f}`);
  }
  return copied;
}

async function seed() {
  try {
    console.log('Seeding filters/brands/categories/collections...');

    const genderData = [
      { id: crypto.randomUUID(), label: 'Men', slug: 'men' },
      { id: crypto.randomUUID(), label: 'Women', slug: 'women' },
      { id: crypto.randomUUID(), label: 'Kids', slug: 'kids' },
    ];
    for (const g of genderData) {
      await db.insert(genders).values(g).onConflictDoNothing({ target: [genders.slug] });
    }

    const colorData = [
      { id: crypto.randomUUID(), name: 'Red', slug: 'red', hexCode: '#FF0000' },
      { id: crypto.randomUUID(), name: 'Black', slug: 'black', hexCode: '#000000' },
      { id: crypto.randomUUID(), name: 'White', slug: 'white', hexCode: '#FFFFFF' },
      { id: crypto.randomUUID(), name: 'Blue', slug: 'blue', hexCode: '#1E3A8A' },
      { id: crypto.randomUUID(), name: 'Green', slug: 'green', hexCode: '#10B981' },
      { id: crypto.randomUUID(), name: 'Grey', slug: 'grey', hexCode: '#6B7280' },
    ];
    for (const c of colorData) {
      await db.insert(colors).values(c).onConflictDoNothing({ target: [colors.slug] });
    }

    const sizeData = [
      { id: crypto.randomUUID(), name: '7', slug: '7', sortOrder: 1 },
      { id: crypto.randomUUID(), name: '8', slug: '8', sortOrder: 2 },
      { id: crypto.randomUUID(), name: '9', slug: '9', sortOrder: 3 },
      { id: crypto.randomUUID(), name: '10', slug: '10', sortOrder: 4 },
      { id: crypto.randomUUID(), name: '11', slug: '11', sortOrder: 5 },
      { id: crypto.randomUUID(), name: '12', slug: '12', sortOrder: 6 },
    ];
    for (const s of sizeData) {
      await db.insert(sizes).values(s).onConflictDoNothing({ target: [sizes.slug] });
    }

    const nikeBrand: { id: string; name: string; slug: string; logoUrl?: string } = { id: crypto.randomUUID(), name: 'Nike', slug: 'nike' };
    await db.insert(brands).values(nikeBrand).onConflictDoNothing({ target: [brands.slug] });

    const categoryNames = ['Running', 'Basketball', 'Lifestyle', 'Training', 'Soccer'];
    const categoryData = categoryNames.map((n) => ({ id: crypto.randomUUID(), name: n, slug: slugify(n) }));
    for (const cat of categoryData) {
      await db.insert(categories).values(cat).onConflictDoNothing({ target: [categories.slug] });
    }

    const collectionNames = ["Summer '25", "Fall '25", "Essentials"];
    const collectionsData = collectionNames.map((n) => ({ id: crypto.randomUUID(), name: n, slug: slugify(n), createdAt: new Date() }));
    for (const col of collectionsData) {
      await db.insert(collections).values(col).onConflictDoNothing({ target: [collections.slug] });
    }

    console.log('Copying images if available...');
    const copiedImages = await ensureStaticUploads();

    if (copiedImages.length < 15) {
      throw new Error(`Seeding requires at least 15 local images in /public/shoes; found ${copiedImages.length}.`);
    }
    const selectedImages = copiedImages.slice(0, 15);

    console.log('Seeding 15 products with variants and images...');
    const gendersAll = await db.select().from(genders);
    const colorsAll = await db.select().from(colors);
    const sizesAll = await db.select().from(sizes);
    const catsAll = await db.select().from(categories);
    const colsAll = await db.select().from(collections);
    await db.delete(productImages);
    await db.delete(productVariants);
    await db.delete(productCollections);
    await db.delete(products);


    const productNames = [
      'Air Max 90',
      'Air Force 1',
      'Dunk Low',
      'React Infinity Run',
      'Blazer Mid',
      'Air Jordan 1',
      'Pegasus Trail',
      'Metcon 9',
      'Mercurial Vapor',
      'Phantom GX',
      'Air Zoom Alphafly',
      'Invincible Run',
      'ZoomX Streakfly',
      'SB Dunk High',
      'Structure 25',
    ];

    for (let i = 0; i < 15; i++) {
      const name = `Nike ${productNames[i]}`;
      const gender = gendersAll[i % gendersAll.length];
      const cat = catsAll[i % catsAll.length];
      const brand = nikeBrand;
      const pid = crypto.randomUUID();

      await db.insert(products).values({
        id: pid,
        name,
        description: `${name} by Nike, engineered for comfort and performance.`,
        categoryId: cat.id,
        genderId: gender.id,
        brandId: brand.id,
        isPublished: true,
        defaultVariantId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const colorChoices = [colorsAll[i % colorsAll.length], colorsAll[(i + 2) % colorsAll.length]];
      const sizeChoices = [sizesAll[1], sizesAll[2], sizesAll[3]];

      let primaryVariantId: string | null = null;
      let skuCounter = 1;

      for (const col of colorChoices) {
        for (const sz of sizeChoices) {
          const vid = crypto.randomUUID();
          const basePrice = 90 + (i % 5) * 10;
          const price = (basePrice + (skuCounter % 3) * 5).toFixed(2);
          const sale = skuCounter % 4 === 0 ? (basePrice - 10).toFixed(2) : null;

          await db.insert(productVariants).values({
            id: vid,
            productId: pid,
            sku: `${slugify(productNames[i])}-${col.slug}-${sz.slug}-${skuCounter}`,
            price: price,
            salePrice: sale ?? undefined,
            colorId: col.id,
            sizeId: sz.id,
            inStock: 10 + ((i + skuCounter) % 10),
            weight: 0.5 + ((skuCounter % 5) * 0.1),
            dimensions: { length: 30, width: 10 + (skuCounter % 3), height: 12 },
            createdAt: new Date(),
          });

          if (!primaryVariantId) primaryVariantId = vid;

          if (primaryVariantId === vid) {
            const uniqueProductImage = selectedImages[i];

            await db.insert(productImages).values({
              id: crypto.randomUUID(),
              productId: pid,
              variantId: null,
              url: uniqueProductImage,
              sortOrder: 0,
              isPrimary: true,
            });

            await db.insert(productImages).values({
              id: crypto.randomUUID(),
              productId: pid,
              variantId: vid,
              url: uniqueProductImage,
              sortOrder: 0,
              isPrimary: true,
            });
          }
          skuCounter++;
        }
      }

      if (primaryVariantId) {
        await db.update(products).set({ defaultVariantId: primaryVariantId, updatedAt: new Date() }).where(eq(products.id, pid));
      }

      const assignedCollection = colsAll[i % colsAll.length];
      await db.insert(productCollections).values({
        id: crypto.randomUUID(),
        productId: pid,
        collectionId: assignedCollection.id,
      });

      console.log(`Seeded product: ${name}`);
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  }
}

seed();
