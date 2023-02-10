# Todo List App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies with pnpm (recommended) and make sure that your node version is 18 or greater.
```bash
pnpm install
```

Second, you need to create a `.env.local` file to define some environments. You just can duplicate the `.env.sample` file and put your upstash credentials. For this project, we prefer to use [`upstash`](https://upstash.com/) as Serverless API. So you can create a free account and generate the REST API credentials in the console.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL= # put your upstash url here
UPSTASH_REDIS_REST_TOKEN= # put your upstash token here
```

Then you may run the development server

```bash
pnpm run dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/lists](http://localhost:3000/api/lists). This endpoint can be edited in `pages/api/lists/index.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The project was deployment with [Vercel Platform](https://vercel.com) from the creators of Next.js.

> You must pay attention to properly setting credentials in your deployment before build

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
