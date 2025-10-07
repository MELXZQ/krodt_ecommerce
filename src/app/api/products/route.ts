import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasDb =
      !!process.env.DATABASE_URL ||
      !!process.env.NEON_DATABASE_URL ||
      !!process.env.POSTGRES_URL;

    if (!hasDb) {
      return NextResponse.json([]);
    }

    const { db } = await import('@/lib/db');
    const { products } = await import('@/lib/db/schema');

    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
