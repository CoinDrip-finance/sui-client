import { useMemo } from 'react';

import { IStreamResponse } from '../../types';
import { formatNumber, getAmountStreamed, getClaimedAmount, getDepositAmount } from '../../utils/presentation';

export default function Overview({ data, tokenIcon }: { data: IStreamResponse; tokenIcon?: string }) {
  const amountStreamed = useMemo(() => {
    return formatNumber(getAmountStreamed(data).value);
  }, [data]);

  const deposit = useMemo(() => {
    return formatNumber(getDepositAmount(data));
  }, [data]);

  const claimed = useMemo(() => {
    return formatNumber(getClaimedAmount(data).value);
  }, [data]);

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
          <div className="font-medium text-xl text-primary">{data?.stream?.payment?.token_name}</div>
        </div>
        <div className="font-medium text-lg text-neutral-400">
          out of {deposit} {data?.stream?.payment?.token_name}
        </div>
      </div>

      <div className="flex items-center flex-col space-y-3 mt-8">
        <div>Amount Claimed</div>
        <div className="flex items-center space-x-6">
          <div className="font-medium text-4xl">{claimed}</div>
          <div className="font-medium text-xl text-primary">{data?.stream?.payment?.token_name}</div>
        </div>
      </div>
    </>
  );
}
