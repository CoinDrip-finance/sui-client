import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { network } from '../../config';
import { IStreamFields, IStreamResource, IStreamResponse, StreamStatus } from '../../types';
import { getShortAddress, getStreamStatus } from '../../utils/presentation';
import { useSuiClientQuery } from '@mysten/dapp-kit';

export default function SenderRecipientDetails({ senderAddress, recipientAddress }: { senderAddress: string; recipientAddress: string }) {
  const { data: _senderName } = useSuiClientQuery(
    'resolveNameServiceNames',
    {
      address: senderAddress
    },
    { enabled: !!senderAddress }
  );
  const { data: _recipientName } = useSuiClientQuery(
    'resolveNameServiceNames',
    {
      address: recipientAddress
    },
    { enabled: !!recipientAddress }
  );

  const senderName = useMemo(() => {
    return _senderName?.data?.[0];
  }, [_senderName]);


  const recipientName = useMemo(() => {
    return _recipientName?.data?.[0];
  }, [_recipientName]);

  return (
    <div className="mt-12 flex items-center relative flex-col sm:flex-row space-y-4 sm:space-y-0">
      <div className="w-full sm:flex-1 text-neutral-400">
        <div className="mb-1">Sender</div>
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 px-5 py-2">
          <a
            href={`${process.env.NEXT_PUBLIC_EXPLORER}/account/${senderAddress}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline inline-flex items-center text-white"
          >
            {senderName ? `@${senderName}` : getShortAddress(senderAddress || "", 6)}{" "}
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
          <a
            href={`${process.env.NEXT_PUBLIC_EXPLORER}/account/${recipientAddress}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline inline-flex items-center"
          >
            {recipientName ? `@${recipientName}` : getShortAddress(recipientAddress || "", 6)}{" "}
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
