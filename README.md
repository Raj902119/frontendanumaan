This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Anumaan Frontend

## Orders Page

The Orders page displays active and closed trades for users. It features:

- **Active Trades Tab**: Shows current investments with live gains and exit options
- **Closed Trades Tab**: Displays completed trades with final returns

### API Integration

The Orders page connects to the following backend endpoints:

- `/api/v1/trades/active` - Fetches active trades
- `/api/v1/trades/closed` - Fetches closed trades
- `/api/v1/trades/current-value` - Gets the total current value of active trades
- `/api/v1/trades/todays-returns` - Gets returns from trades closed today
- `/api/v1/trades/stats` - Gets overall trade statistics
- `/api/v1/trades/:tradeId/exit` - Exits an active trade

### Redux State Management

The app uses Redux for state management with the following slices:

- `orderSlice.ts` - Manages orders and trades data
- `portfolioSlice.ts` - Manages portfolio and wallet information

### Data Refresh

The Orders page automatically refreshes data every 30 seconds to keep information current.
