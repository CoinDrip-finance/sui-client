import moment from "moment";

import { generateNftSvg } from "../../../../utils/nft-image";

import type { NextApiRequest, NextApiResponse } from "next";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { extractTokenName } from "../../../../utils/presentation";

export const config = {
  runtime: "edge",
};

// @ts-ignore
const rpcUrl = getFullnodeUrl(process.env.NEXT_PUBLIC_NETWORK);
const client = new SuiClient({ url: rpcUrl });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get("id");

  const streamObject = await client.getObject({
    id: id!,
    options: {
      showContent: true
    }
  });

  // @ts-ignore
  const streamData = streamObject?.data?.content?.fields;

  const tokenMetadata = await client.getCoinMetadata({
    coinType: streamData?.token
  });

  const percentDone = Math.min(moment().diff(parseInt(streamData.start_time), 'ms') / (parseInt(streamData.end_time) - parseInt(streamData.start_time)) * 100, 100);

  const durationInDays = moment(parseInt(streamData.end_time)).diff(moment(parseInt(streamData.start_time)), "days");
  const svg = await generateNftSvg(
    streamObject.data?.objectId!,
    streamObject.data?.objectId!,
    extractTokenName(streamData.token),
    streamData.balance,
    tokenMetadata?.decimals!,
    durationInDays,
    percentDone
  );

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
