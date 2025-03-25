import { BoltIcon, CalendarDaysIcon, CalendarIcon, ClockIcon, WalletIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useMemo } from 'react';

import { IStreamResource } from '../../types';
import { denominate } from '../../utils/economics';
import { extractTokenName, getStreamStatus } from '../../utils/presentation';
import StreamPropItem from './StreamPropItem';
import { CoinMetadata } from '@mysten/sui/dist/cjs/client';

const formatDate = (date: number): string => {
  return moment(date).format("MMM D 'YY, H a");
};

export default function StreamProps({ data, tokenMetadata }: { data: IStreamResource; tokenMetadata?: CoinMetadata }) {
  const status = useMemo(() => {
    return getStreamStatus(data);
  }, [data]);

  const deposit = useMemo(() => {
    if (!tokenMetadata) return "0";
    return `${denominate(data.amount, 5, tokenMetadata?.decimals)} ${extractTokenName(data.token)
      }`;
  }, [data, tokenMetadata]);

  const createdOn = useMemo(() => {
    return formatDate(data.start_time);
  }, [data]);

  const willEndOn = useMemo(() => {
    return formatDate(data.end_time);
  }, [data]);

  const cliff = useMemo(() => {
    if (parseInt(data.cliff) === 0) {
      return "No cliff";
    }

    return moment(data.start_time).add(parseInt(data.cliff), "milliseconds").toString();
  }, [data]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg mt-8 p-5 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
      <StreamPropItem label="Status" value={status} Icon={BoltIcon} />
      <StreamPropItem label="Deposit" value={deposit} Icon={WalletIcon} />
      {/* <StreamPropItem label="Cancelable" value={cancelable} Icon={XCircleIcon} /> */}

      <StreamPropItem label="Created on" value={createdOn} Icon={CalendarIcon} />
      <StreamPropItem label="Will end" value={willEndOn} Icon={CalendarDaysIcon} />
      {cliff.startsWith("No") ? (
        <StreamPropItem label="Cliff" value={cliff} Icon={ClockIcon} />
      ) : (
        <StreamPropItem label="Cliff ends" date={cliff} Icon={ClockIcon} />
      )}
    </div>
  );
}
