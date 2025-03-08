import { useMemo } from 'react';

import { IStreamResponse } from '../../types';
import { getAmountStreamed, getClaimedAmount } from '../../utils/presentation';
import ProgressBarSmall from '../stream_list/ProgressBarSmall';

export default function StreamProgressBars({ data }: { data: IStreamResponse }) {
  const amountStreamed = useMemo(() => {
    return getAmountStreamed(data).percent;
  }, [data]);

  const claimed = useMemo(() => {
    return getClaimedAmount(data).percent;
  }, [data]);

  return (
    <div className="flex items-center sm:space-x-16 mt-8 flex-col sm:flex-row space-y-4 sm:space-y-0">
      <div className="w-full">
        <div className="text-neutral-400 mb-1">Streamed amount</div>
        <div className="flex items-center bg-neutral-900 rounded-lg py-2 px-6 border border-neutral-800">
          <ProgressBarSmall value={amountStreamed} />
          <div className="ml-3 font-medium">{amountStreamed}%</div>
        </div>
      </div>
      <div className="w-full">
        <div className="text-neutral-400 mb-1">Withdrawn amount</div>
        <div className="flex items-center bg-neutral-900 rounded-lg py-2 px-6 border border-neutral-800">
          <ProgressBarSmall value={claimed} />
          <div className="ml-3 font-medium">{claimed}%</div>
        </div>
      </div>
    </div>
  );
}
