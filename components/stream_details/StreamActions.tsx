import {
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  HandRaisedIcon,
  PaperAirplaneIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { KeyedMutator } from "swr";

import { network } from "../../config";
import { IStreamResource, IStreamResponse, StreamStatus } from "../../types";
import { getStreamStatus } from "../../utils/presentation";
import CancelPopup from "./CancelPopup";
import ClaimAfterCancelPopup from "./ClaimAfterCancelPopup";
import ClaimPopup from "./ClaimPopup";
import MoreActionsPopup, { MoreActionsItem } from "./MoreActionsPopup";
import { CoinMetadata } from '@mysten/sui/client';

interface StreamActionProps {
  data: IStreamResource;
  tokenMetadata: CoinMetadata;
  streamRecipient: string;
  refresh: KeyedMutator<IStreamResource>;
}

export enum StreamActionType {
  Claim,
  Cancel,
  ClaimAfterCancel,
  RenounceCancelStream,
  Transfer,
  Share,
}

export default function StreamActions({ data, refresh, streamRecipient, tokenMetadata }: StreamActionProps) {
  const [claimPopupOpen, setClaimPopupOpen] = useState(false);
  const [moreActionsPopup, setMoreActionsPopup] = useState(false);

  const streamStatus = useMemo(() => {
    return getStreamStatus(data);
  }, [data]);

  const onClaimPopupClose = () => {
    refresh();
    setClaimPopupOpen(false);
  };

  const onMoreActionsPopupClose = (action?: StreamActionType) => {
    setMoreActionsPopup(false);

    switch (action) {
      case StreamActionType.Claim:
        setClaimPopupOpen(true);
        break;
    }
  };

  const disabledActions = {
    [StreamActionType.Claim]: streamStatus === StreamStatus.Finished || streamStatus === StreamStatus.Pending,
  };

  const allActionsList: MoreActionsItem[] = [
    {
      type: StreamActionType.Claim,
      title: "Withdraw from stream",
      description: "Funds that have been streamed can be withdrawn by the recipient.",
      Icon: ArrowDownTrayIcon,
      buttonLabel: "Withdraw",
      disabled: disabledActions[StreamActionType.Claim],
    },
    {
      type: StreamActionType.Transfer,
      title: "Transfer Stream",
      description: "The recipient has the ability to send this NFT stream to a different address.",
      Icon: PaperAirplaneIcon,
      buttonLabel: "Transfer",
      disabled: true,
    },
  ];

  return (
    <>
      <div className="mt-8">
        <div className="text-neutral-400">Actions</div>

        <div className="mt-2 sm:flex justify-between items-center grid grid-cols-2 gap-4">
          <button
            className="stream-action-button"
            onClick={() =>
              setClaimPopupOpen(true)
            }
            disabled={disabledActions[StreamActionType.Claim]}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Withdraw
          </button>
          <button className="stream-action-button" onClick={() => setMoreActionsPopup(true)}>
            <EllipsisHorizontalIcon className="w-5 h-5 mr-2" />
            More options
          </button>
        </div>
      </div>

      <ClaimPopup data={data} tokenMetadata={tokenMetadata} open={claimPopupOpen} onClose={onClaimPopupClose} streamRecipient={streamRecipient} />

      <MoreActionsPopup open={moreActionsPopup} onClose={onMoreActionsPopupClose} items={allActionsList} />
    </>
  );
}
