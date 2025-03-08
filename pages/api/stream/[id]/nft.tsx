import moment from "moment";

import { IStreamResponse } from "../../../../types";
import { generateNftSvg } from "../../../../utils/nft-image";

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get("id");

  const baseUrl = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000";
  const streamData: IStreamResponse = await fetch(`${baseUrl}/api/stream/${id}`).then((res) => res.json());

  const durationInDays = moment(streamData.stream.end_time).diff(moment(streamData.stream.start_time), "days");
  const svg = await generateNftSvg(
    streamData.tx_hash,
    streamData.id,
    streamData.stream.payment.token_identifier,
    streamData.stream.can_cancel,
    durationInDays
  );

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
