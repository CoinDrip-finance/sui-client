import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { network } from '../../config';
import { IStreamResponse, StreamStatus } from '../../types';
import { getShortAddress, getStreamStatus } from '../../utils/presentation';

export default function SenderRecipientDetails({ data }: { data: IStreamResponse }) {
  const [recipient, setRecipient] = useState("Loading recipient...");

  const [senderUsername, setSenderUsername] = useState();
  const [recipientUsername, setRecipientUsername] = useState();

  useEffect(() => {
    if (!data) return;
    (async () => {
      const streamStatus = await getStreamStatus(data);
      if (streamStatus === StreamStatus.Finished || streamStatus === StreamStatus.Canceled) {
        setRecipient(data.stream.last_claim_by || `Stream ${streamStatus}`);
      } else {
        const {
          data: { owner },
        } = await axios.get(`${network.apiAddress}/nfts/${data.nft?.identifier}`);
        setRecipient(owner);
      }
    })();
  }, [data?.id]);

  useEffect(() => {
    (async () => {
      const { data: account } = await axios.get(`${network.apiAddress}/accounts/${data.stream.sender}`);
      setSenderUsername(account?.username?.replace(".elrond", ""));
    })();
  }, [data?.stream?.sender]);

  useEffect(() => {
    if (!recipient?.startsWith("erd1")) return;
    (async () => {
      const { data: account } = await axios.get(`${network.apiAddress}/accounts/${recipient}`);
      setRecipientUsername(account?.username?.replace(".elrond", ""));
    })();
  }, [recipient]);

  return (
    <div className="mt-12 flex items-center relative flex-col sm:flex-row space-y-4 sm:space-y-0">
      <div className="w-full sm:flex-1 text-neutral-400">
        <div className="mb-1">Sender</div>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 px-5 py-2">
          <a
            href={`${network.explorerAddress}/accounts/${data?.stream?.sender}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline inline-flex items-center text-white"
          >
            {senderUsername ? `@${senderUsername}` : getShortAddress(data?.stream?.sender || "", 6)}{" "}
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
      <div className="absolute -z-10 w-1/4 mx-auto inset-x-0 -top-6 hidden sm:block">
        <img src="/stream_details/streaming.gif" />
      </div>
      <div className="w-full sm:flex-1 text-neutral-400 sm:ml-32">
        <div className="mb-1">Recipient</div>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 px-4 py-2 text-white">
          {recipient?.startsWith("erd1") ? (
            <a
              href={`${network.explorerAddress}/accounts/${recipient}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline inline-flex items-center"
            >
              {recipientUsername ? `@${recipientUsername}` : getShortAddress(recipient, 6)}{" "}
              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
            </a>
          ) : (
            <>{recipient}</>
          )}
        </div>
      </div>
    </div>
  );
}
