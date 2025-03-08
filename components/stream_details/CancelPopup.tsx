import { useAuth } from "@elrond-giants/erd-react-hooks/dist";
import { ArrowDownTrayIcon, BanknotesIcon, ChartPieIcon, KeyIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";

import { useTransaction } from "../../hooks/useTransaction";
import { IStreamResponse } from "../../types";
import StreamingContract from "../../utils/contracts/streamContract";
import { denominate } from "../../utils/economics";
import { formatNumber, getAmountStreamed, getClaimedAmount, getDepositAmount } from "../../utils/presentation";
import StreamDetailsBasePopup from "./PopupBase";
import StreamPropItem from "./StreamPropItem";

interface CancelPopupProps {
  data: IStreamResponse;
  streamRecipient?: string;
  open: boolean;
  onClose: () => void;
}

export default function CancelPopup({ data, open, onClose, streamRecipient }: CancelPopupProps) {
  const { address } = useAuth();
  const { makeTransaction } = useTransaction();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!address) return;
    const streamingContract = new StreamingContract(address);
    const interaction = streamingContract.cancelStream(data.id, address === streamRecipient);

    try {
      setLoading(true);
      const txResult = await makeTransaction(interaction.buildTransaction());
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const deposited = useMemo(() => {
    return getDepositAmount(data);
  }, [data]);

  const amountStreamed = useMemo(() => {
    return getAmountStreamed(data);
  }, [data]);

  const claimed = useMemo(() => {
    return getClaimedAmount(data);
  }, [data]);

  const readyToClaimByRecipient = useMemo(() => {
    return denominate(data.stream.balance?.recipient_balance || 0, 5, data.stream.payment.token_decimals).toNumber();
  }, [data.stream.balance?.recipient_balance]);

  const readyToClaimBySender = useMemo(() => {
    return deposited - claimed.value - readyToClaimByRecipient;
  }, [deposited, claimed, readyToClaimByRecipient]);

  return (
    <StreamDetailsBasePopup
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Cancel stream"
      hideSubmitButton={(streamRecipient !== address && data?.stream?.sender !== address) || loading}
      submitButtonLabel="Cancel"
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
            label="Withdrawable by recipient"
            value={`${formatNumber(readyToClaimByRecipient)} ${data.stream.payment.token_name}`}
            Icon={BanknotesIcon}
          />
          <StreamPropItem
            label="Withdrawable by sender"
            value={`${formatNumber(readyToClaimBySender)} ${data.stream.payment.token_name}`}
            Icon={BanknotesIcon}
          />
        </div>

        {streamRecipient !== address && data?.stream?.sender !== address && (
          <div className="bg-neutral-800 border border-neutral-700 py-2 px-4 rounded-lg text-sm mt-8">
            <div className="flex items-center font-semibold text-orange-400">
              <KeyIcon className="w-5 h-5 mr-2" />
              Missing permissions
            </div>
            <p className="font-light mt-2">
              You are not the recipient or sender of the stream. Only the sender or recipient can cancel this stream.
            </p>
          </div>
        )}
      </div>
    </StreamDetailsBasePopup>
  );
}
