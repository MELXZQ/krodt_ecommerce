# Krodt E-commerce

A modern e-commerce application built with Next.js, TypeScript, Tailwind CSS, Better Auth, Neon PostgreSQL, Drizzle ORM, and Zustand.

## Features

- 🛍️ Product catalog with Nike items
- 🎨 Modern UI with Tailwind CSS
- 🔐 Authentication with Better Auth
- 🗄️ PostgreSQL database with Neon
- 🔄 Type-safe database operations with Drizzle ORM
- 🏪 State management with Zustand
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd krodt_ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database credentials:
   ```
   DATABASE_URL="postgresql://username:password@hostname:port/database"
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. Generate and push database schema:
   ```bash
   npm run db:push
   ```

5. Seed the database with sample Nike products:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
src/
├── app/
│   ├── api/products/     # API routes
│   └── page.tsx          # Home page
├── components/
│   └── ProductCard.tsx   # Product display component
├── lib/
│   └── db/
│       ├── index.ts      # Database connection
│       └── schema.ts     # Database schema
└── store/
    └── products.ts       # Zustand store
```

## Development

The application includes:

- **Products API**: `/api/products` - Fetches all products from the database
- **Product Schema**: Includes name, description, price, image, category, brand, size, color, and stock
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request