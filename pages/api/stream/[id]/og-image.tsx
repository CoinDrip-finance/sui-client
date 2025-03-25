import { ImageResponse } from "@vercel/og";
import moment from "moment";
import { NextApiHandler } from "next";
import { denominate } from "../../../../utils/economics";
import { extractTokenName, formatNumber, getShortAddress } from "../../../../utils/presentation";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

export const config = {
  runtime: "edge",
};

// @ts-ignore
const rpcUrl = getFullnodeUrl(process.env.NEXT_PUBLIC_NETWORK);
const client = new SuiClient({ url: rpcUrl });

const handler: NextApiHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get("id");
    const imageData = await fetch(new URL("./og_base.png", import.meta.url).toString()).then((res) =>
      res.arrayBuffer()
    );
    if (!id) {
      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <img width="1200" height="650" src={`data:image/png;base64,${Buffer.from(imageData).toString("base64")}`} />
          </div>
        ),
        {
          width: 1200,
          height: 650,
        }
      );
    }

    const streamObject = await client.getObject({
      id: id!,
      options: {
        showContent: true
      }
    });

    // @ts-ignore
    const streamData = streamObject?.data?.content?.fields;

    const tokenMetadata = await client.getCoinMetadata({
      coinType: streamData.token
    });

    const durationInDays = moment(parseInt(streamData.end_time)).diff(moment(parseInt(streamData.start_time)), "days");

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img width="1200" height="650" src={`data:image/png;base64,${Buffer.from(imageData).toString("base64")}`} />

          <div
            style={{
              position: "absolute",
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              paddingLeft: "59px",
              paddingRight: "59px",
              zIndex: 10,
              color: "white",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div style={{ display: "flex", fontSize: 32 }}>Token Stream {getShortAddress(id, 10)}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "26px", fontWeight: "bold" }}>
                    {extractTokenName(streamData.token)}
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Token</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "26px", fontWeight: "bold" }}>
                    {formatNumber(
                      denominate(
                        streamData.initial_deposit,
                        2,
                        tokenMetadata?.decimals
                      ).toNumber()
                    )}
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Initial Deposit</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "26px", fontWeight: "bold" }}>        {formatNumber(
                    denominate(
                      streamData.balance,
                      2,
                      tokenMetadata?.decimals
                    ).toNumber()
                  )}</div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Balance</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", fontSize: "26px", fontWeight: "bold" }}>
                    {durationInDays}d
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 650,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};

export default handler;
