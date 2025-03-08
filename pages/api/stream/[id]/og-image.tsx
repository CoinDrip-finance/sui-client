import { ImageResponse } from "@vercel/og";
import moment from "moment";
import { NextApiHandler } from "next";

import { IStreamResponse } from "../../../../types";
import { denominate } from "../../../../utils/economics";
import { formatNumber } from "../../../../utils/presentation";

export const config = {
  runtime: "edge",
};

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

    const baseUrl = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000";
    const streamData: IStreamResponse = await fetch(`${baseUrl}/api/stream/${id}`).then((res) => res.json());

    const duration = moment(streamData.stream.end_time).diff(moment(streamData.stream.start_time), "days");

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
              <div style={{ display: "flex", fontSize: 32 }}>Token Stream #{id}</div>
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
                    {streamData.stream.payment.token_identifier}
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
                        streamData.stream.payment.amount,
                        2,
                        streamData.stream.payment.token_decimals
                      ).toNumber()
                    )}
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Deposit</div>
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
                  <div style={{ display: "flex", fontSize: "26px", fontWeight: "bold" }}>{duration}d</div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Duration</div>
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
                    {streamData.stream.can_cancel ? "Yes" : "No"}
                  </div>
                  <div style={{ display: "flex", fontSize: "16px", fontWeight: "bold" }}>Cancelable</div>
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
