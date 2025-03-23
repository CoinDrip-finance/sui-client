import { useMemo } from 'react';

import { IStreamFields, IStreamResource, IStreamResponse } from '../../types';
import { extractTokenName, formatNumber, getAmountStreamed, getClaimedAmount, getDepositAmount } from '../../utils/presentation';
import { CoinMetadata } from '@mysten/sui/client';
import { denominate } from '../../utils/economics';

export default function Overview({ data, tokenMetadata, tokenIcon }: { data: IStreamResource; tokenMetadata: CoinMetadata; tokenIcon?: string }) {
  const amountStreamed = useMemo(() => {
    return formatNumber(getAmountStreamed(data, tokenMetadata).value);
  }, [data, tokenMetadata]);

  const deposit = useMemo(() => {
    if (!data || !tokenMetadata) return '0';
    return formatNumber(getDepositAmount(data, tokenMetadata));
  }, [data, tokenMetadata]);

  const claimed = useMemo(() => {
    if (!data || !tokenMetadata) return '0';
    return formatNumber(getClaimedAmount(data, tokenMetadata).value);
  }, [data, tokenMetadata]);

  return (
    <>
      <div className="flex items-center flex-col space-y-4">
        <div>Total Amount Streamed</div>
        <div className="flex items-center space-x-8">
          {tokenIcon ? (
            <img src={tokenIcon} className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 bg-primary rounded-full"></div>
          )}
          <div className="font-medium text-5xl">{amountStreamed}</div>
          <div className="font-medium text-xl text-primary">{extractTokenName(data.token)}</div>
        </div>
        <div className="font-medium text-lg text-neutral-400">
          out of {deposit} {extractTokenName(data.token)}
        </div>
      </div>

      <div className="flex items-center flex-col space-y-3 mt-8">
        <div>Amount Claimed</div>
        <div className="flex items-center space-x-6">
          <div className="font-medium text-4xl">{claimed}</div>
          <div className="font-medium text-xl text-primary">{extractTokenName(data.token)}</div>
        </div>
      </div>
    </>
  );
}
