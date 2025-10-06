import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema';

const nikeProducts = [
  {
    name: 'Nike Air Max 90',
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details.',
    price: '119.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-max-90-mens-shoes-6n7J06.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '10',
    color: 'White/Black',
    stock: 25,
  },
  {
    name: 'Nike Air Force 1',
    description: 'The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best.',
    price: '109.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '9',
    color: 'White',
    stock: 30,
  },
  {
    name: 'Nike Dunk Low',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors.',
    price: '99.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/61077282-1d6e-4b1f-9c65-5d5c5c8b5c5c/dunk-low-mens-shoes-LLKMCX.png',
    category: 'Shoes',
    brand: 'Nike',
    size: '11',
    color: 'Black/White',
    stock: 20,
  },
  {
    name: 'Nike React Infinity Run',
    description: 'A lightweight, responsive running shoe designed to help reduce injury and keep you on the run.',
    price: '159.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8439f823-86cf-4086-81d2-4f9ff9a66866/react-infinity-run-flyknit-3-mens-road-running-shoes-ZQGpHZ.png',
    category: 'Running',
    brand: 'Nike',
    size: '10.5',
    color: 'Blue/White',
    stock: 15,
  },
  {
    name: 'Nike Blazer Mid',
    description: 'The Nike Blazer Mid brings a timeless design back to the streets while delivering the comfort you need.',
    price: '89.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/05859dc8-6acc-4d9e-9b95-5d5c5c8b5c5c/blazer-mid-77-vintage-mens-shoes-nw30B2.png',
    category: 'Lifestyle',
    brand: 'Nike',
    size: '9.5',
    color: 'White/Black',
    stock: 18,
  },
  {
    name: 'Nike Air Jordan 1',
    description: 'The Air Jordan 1 Retro High OG lets you fly in the original that started it all.',
    price: '169.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e6da41fa-1be4-4ce5-9be8-5d5c5c8b5c5c/air-jordan-1-retro-high-og-mens-shoes-Lg5NNr.png',
    category: 'Basketball',
    brand: 'Nike',
    size: '10',
    color: 'Chicago Red',
    stock: 12,
  },
];

async function seed() {
  try {
    console.log('Seeding database...');
    
    await db.insert(products).values(nikeProducts);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();