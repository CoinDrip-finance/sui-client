export const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
export const denomination = parseInt(process.env.NEXT_PUBLIC_DENOMINATION as string, 9);
export const buildId = (process.env.VERCEL_DEPLOYMENT_ID ?? '').replace('dpl_', '');