
# Marketplace App

This is a modern online marketplace UI built with [Next.js 15](https://nextjs.org), [React 19](https://react.dev), [Tailwind CSS](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com/). It uses [Supabase](https://supabase.com) as the backend for listings, messaging, and storage.

## Features

- Create, preview, and list products with images, categories, and seller info
- Responsive, glassmorphic UI with modern design and micro-interactions
- Real-time search, category filtering, and recommendations
- Product details modal with large image and accessible close
- Message Seller dialog with email, subject, and message fields
- Messaging system with Supabase backend and email notifications
- All user input is previewed live before submission

## Getting Started


1. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.


## Environment Variables

You must set the following in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

See `.env.local.example` for a template.

## Project Structure

- `src/app/` — Main Next.js app and pages
- `src/components/` — UI components (product card, dialogs, forms, etc.)
- `src/lib/` — Supabase client and utility logic

## Customization

This project uses Tailwind CSS and shadcn/ui for styling. You can easily adjust the look and feel by editing Tailwind classes in the components.

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
