import { ArrowDownTrayIcon, BanknotesIcon, ChartPieIcon, ClockIcon, KeyIcon, WalletIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useMemo, useState } from 'react';
import Moment from 'react-moment';
import { useTransaction } from '../../hooks/useTransaction';
import { IStreamResource, StreamStatus } from '../../types';
import { extractTokenName, formatNumber, getAmountStreamed, getClaimedAmount, getDepositAmount, getShortAddress, getStreamStatus } from '../../utils/presentation';
import AggregatorTokenSelect, { AggregatorToken } from './AggregatorTokenSelect';
import StreamDetailsBasePopup from './PopupBase';
import StreamPropItem from './StreamPropItem';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { CoinMetadata } from '@mysten/sui/dist/cjs/client';
import { Transaction } from '@mysten/sui/transactions';

interface ClaimPopupProps {
  data: IStreamResource;
  tokenMetadata: CoinMetadata;
  streamRecipient?: string;
  open: boolean;
  onClose: () => void;
}

export default function ClaimPopup({ data, open, onClose, streamRecipient, tokenMetadata }: ClaimPopupProps) {
  const account = useCurrentAccount();
  const address = account?.address;
  const [loading, setLoading] = useState(false);
  const [claimToken, setClaimToken] = useState<AggregatorToken | null>();
  const { sendTransaction } = useTransaction();

  const status = useMemo(() => {
    return getStreamStatus(data);
  }, [data])

  const onSubmit = async () => {
    if (!address) return;

    try {
      const tx = new Transaction();
      tx.setSender(account.address);
      tx.setGasBudget(50_000_000);

      const [coin] = tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::claim_from_stream`,
        typeArguments: [data.token],
        arguments: [
          tx.object(process.env.NEXT_PUBLIC_CONTROLLER_ID!),
          tx.object(data.stream_id),
          tx.object("0x6")
        ]
      });

      tx.transferObjects([coin], account.address);

      if (status === StreamStatus.Settled) {
        tx.moveCall({
          target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::destroy_zero`,
          typeArguments: [data.token],
          arguments: [
            tx.object(process.env.NEXT_PUBLIC_CONTROLLER_ID!),
            tx.object(data.stream_id),
          ]
        });
      }

      await sendTransaction(tx);
      onClose();
    } catch (e) { }
  };

  const deposited = useMemo(() => {
    return formatNumber(getDepositAmount(data, tokenMetadata));
  }, [data, tokenMetadata]);

  const amountStreamed = useMemo(() => {
    return getAmountStreamed(data, tokenMetadata);
  }, [data, tokenMetadata]);

  const claimed = useMemo(() => {
    return getClaimedAmount(data, tokenMetadata);
  }, [data, tokenMetadata]);

  const cliff = useMemo(() => {
    const cliff = parseInt(data.cliff);
    if (cliff === 0) {
      return null;
    }
    const currentDate = moment();
    const cliffEnd = moment(data.start_time).add(cliff, "ms");

    if (currentDate >= cliffEnd) {
      return null;
    }

    return cliffEnd.toString();
  }, [data]);

  const readyToClaim = useMemo(() => {
    return amountStreamed.value - claimed.value;
  }, [amountStreamed, claimed]);

  return (
    <StreamDetailsBasePopup
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Withdraw from stream"
      hideSubmitButton={streamRecipient !== address || readyToClaim <= 0 || !!cliff || loading}
      submitButtonLabel="Withdraw"
    >
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          <StreamPropItem
            label="Deposited"
            value={`${deposited} ${extractTokenName(data.token)}`}
            Icon={WalletIcon}
          />
          <StreamPropItem
            label="Streamed"
            value={`${formatNumber(amountStreamed.value)} ${extractTokenName(data.token)}`}
            Icon={ChartPieIcon}
          />
          <StreamPropItem
            label="Withdrawn"
            value={`${formatNumber(claimed.value)} ${extractTokenName(data.token)}`}
            Icon={ArrowDownTrayIcon}
          />
          <StreamPropItem
            label="Withdrawable"
            value={`${formatNumber(readyToClaim)} ${extractTokenName(data.token)}`}
            Icon={BanknotesIcon}
          />
        </div>

        {streamRecipient !== address && (
          <div className="bg-neutral-800 border border-neutral-700 py-2 px-4 rounded-lg text-sm mt-8">
            <div className="flex items-center font-semibold text-orange-400">
              <KeyIcon className="w-5 h-5 mr-2" />
              Missing permissions
            </div>
            <p className="font-light mt-2">
              You are not the recipient of the stream. Only the owner of NFT{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_EXPLORER}/object/${data.stream_id}`}
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                {getShortAddress(data.stream_id, 10)}
              </a>{" "}
              can withdraw from this stream.
            </p>
          </div>
        )}

        {cliff && (
          <div className="bg-neutral-800 border border-neutral-700 py-2 px-4 rounded-lg text-sm mt-8">
            <div className="flex items-center font-semibold text-orange-400">
              <ClockIcon className="w-5 h-5 mr-2" />
              Active cliff period
            </div>
            <p className="font-light mt-2">
              This stream has an active cliff. You will be able to claim <Moment fromNow>{cliff}</Moment>.
            </p>
          </div>
        )}

        <AggregatorTokenSelect defaultToken={data.token} onSelect={setClaimToken} />
      </div>
    </StreamDetailsBasePopup>
  );
}
