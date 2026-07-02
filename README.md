# DevEvents

DevEvents is a full-stack Next.js application designed to discover, track, and manage developer events.

## Tech Stack

- **Framework:** Next.js 15+
- **Styling:** Tailwind CSS
- **Database:** MongoDB (via Mongoose)
- **Image Hosting:** Cloudinary
- **Analytics:** PostHog

## Getting Started

First, ensure you have set up your environment variables based on `.env.example`:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the required secrets in `.env.local` (MongoDB, PostHog, Cloudinary).

Then, run the development server:

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
