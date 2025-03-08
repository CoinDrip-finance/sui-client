import { useAuth } from '@elrond-giants/erd-react-hooks/dist';
import { ArrowDownTrayIcon, BanknotesIcon, ChartPieIcon, ClockIcon, KeyIcon, WalletIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import Moment from 'react-moment';

import { network } from '../../config';
import { useTransaction } from '../../hooks/useTransaction';
import { IStreamResponse } from '../../types';
import StreamingContract from '../../utils/contracts/streamContract';
import { denominate } from '../../utils/economics';
import { formatNumber, getAmountStreamed, getClaimedAmount, getDepositAmount } from '../../utils/presentation';
import AggregatorTokenSelect from './AggregatorTokenSelect';
import StreamDetailsBasePopup from './PopupBase';
import StreamPropItem from './StreamPropItem';

interface ClaimPopupProps {
  data: IStreamResponse;
  streamRecipient?: string;
  open: boolean;
  onClose: () => void;
}

export default function ClaimPopup({ data, open, onClose, streamRecipient }: ClaimPopupProps) {
  const { address } = useAuth();
  const { makeTransaction } = useTransaction();
  const [loading, setLoading] = useState(false);
  const [claimToken, setClaimToken] = useState<string | null>();

  const onSubmit = async () => {
    if (!address) return;
    const streamingContract = new StreamingContract(address);
    let interaction = streamingContract.claimStream(data.id);

    if (claimToken) {
      interaction = await streamingContract.claimStreamSwap(
        data.id,
        data.stream.payment.token_identifier,
        claimToken,
        data.stream.balance?.recipient_balance!
      );
    }

    try {
      setLoading(true);
      const txResult = await makeTransaction(interaction.buildTransaction());
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const deposited = useMemo(() => {
    return formatNumber(getDepositAmount(data));
  }, [data]);

  const amountStreamed = useMemo(() => {
    return getAmountStreamed(data);
  }, [data]);

  const claimed = useMemo(() => {
    return getClaimedAmount(data);
  }, [data]);

  const cliff = useMemo(() => {
    if (data.stream.cliff === 0) {
      return null;
    }
    const currentDate = moment();
    const cliffEnd = moment(data.stream.start_time).add(data.stream.cliff, "seconds");

    if (currentDate >= cliffEnd) {
      return null;
    }

    return cliffEnd.toString();
  }, [data]);

  const readyToClaim = useMemo(() => {
    return denominate(data.stream.balance?.recipient_balance || 0, 5, data.stream.payment.token_decimals).toNumber();
  }, [data.stream.balance?.recipient_balance]);

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
            value={`${deposited} ${data.stream.payment.token_name}`}
            Icon={WalletIcon}
          />
          <StreamPropItem
            label="Streamed"
            value={`${formatNumber(amountStreamed.value)} ${data.stream.payment.token_name}`}
            Icon={ChartPieIcon}
          />
          <StreamPropItem
            label="Withdrawn"
            value={`${formatNumber(claimed.value)} ${data.stream.payment.token_name}`}
            Icon={ArrowDownTrayIcon}
          />
          <StreamPropItem
            label="Withdrawable"
            value={`${formatNumber(readyToClaim)} ${data.stream.payment.token_name}`}
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
                href={`${network.explorerAddress}/nfts/${data.nft?.identifier}`}
                target="_blank"
                className="underline"
                rel="noreferrer"
              >
                {data.nft?.identifier}
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

        <AggregatorTokenSelect defaultToken={data.stream.payment.token_identifier} onSelect={setClaimToken} />
      </div>
    </StreamDetailsBasePopup>
  );
}
