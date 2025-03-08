import { BoltIcon, CalendarDaysIcon, CalendarIcon, ClockIcon, WalletIcon, XCircleIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useMemo } from 'react';

import { IStreamResponse } from '../../types';
import { denominate } from '../../utils/economics';
import { getStreamStatus } from '../../utils/presentation';
import StreamPropItem from './StreamPropItem';

const formatDate = (date: string): string => {
  return moment(date).format("MMM D 'YY, H a");
};

export default function StreamProps({ data }: { data: IStreamResponse }) {
  const status = useMemo(() => {
    return getStreamStatus(data);
  }, [data]);

  const deposit = useMemo(() => {
    return `${denominate(data.stream.payment.amount, 5, data.stream.payment.token_decimals)} ${
      data.stream.payment.token_identifier
    }`;
  }, [data]);

  const cancelable = useMemo(() => {
    if (data.stream.can_cancel) return "Yes";
    return "No";
  }, [data]);

  const createdOn = useMemo(() => {
    return formatDate(data.stream.start_time);
  }, [data]);

  const willEndOn = useMemo(() => {
    return formatDate(data.stream.end_time);
  }, [data]);

  const cliff = useMemo(() => {
    if (data.stream.cliff === 0) {
      return "No cliff";
    }

    return moment(data.stream.start_time).add(data.stream.cliff, "seconds").toString();
  }, [data]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg mt-8 p-5 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
      <StreamPropItem label="Status" value={status} Icon={BoltIcon} />
      <StreamPropItem label="Deposit" value={deposit} Icon={WalletIcon} />
      <StreamPropItem label="Cancelable" value={cancelable} Icon={XCircleIcon} />

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
