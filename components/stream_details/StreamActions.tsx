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
import { IStreamResponse, StreamStatus } from "../../types";
import { getStreamStatus } from "../../utils/presentation";
import CancelPopup from "./CancelPopup";
import ClaimAfterCancelPopup from "./ClaimAfterCancelPopup";
import ClaimPopup from "./ClaimPopup";
import MoreActionsPopup, { MoreActionsItem } from "./MoreActionsPopup";

interface StreamActionProps {
  data: IStreamResponse;
  refresh: KeyedMutator<IStreamResponse>;
}

export enum StreamActionType {
  Claim,
  Cancel,
  ClaimAfterCancel,
  RenounceCancelStream,
  Transfer,
  Share,
}

export default function StreamActions({ data, refresh }: StreamActionProps) {
  const [claimPopupOpen, setClaimPopupOpen] = useState(false);
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [claimAfterCancelPopupOpen, setClaimAfterCancelPopupOpen] = useState(false);
  const [moreActionsPopup, setMoreActionsPopup] = useState(false);

  const [streamRecipient, setStreamRecipient] = useState<string>();

  useEffect(() => {
    if (!data?.nft?.identifier) return;
    (async () => {
      const {
        data: { owner },
      } = await axios.get(`${network.apiAddress}/nfts/${data?.nft?.identifier}`);
      setStreamRecipient(owner);
    })();
  }, [data?.nft?.identifier]);

  const streamStatus = useMemo(() => {
    return getStreamStatus(data);
  }, [data]);

  const onClaimPopupClose = () => {
    refresh();
    setClaimPopupOpen(false);
  };

  const onCancelPopupClose = () => {
    refresh();
    setCancelPopupOpen(false);
  };

  const onClaimAfterCancelPopupClose = () => {
    refresh();
    setClaimAfterCancelPopupOpen(false);
  };

  const onMoreActionsPopupClose = (action?: StreamActionType) => {
    setMoreActionsPopup(false);

    switch (action) {
      case StreamActionType.Claim:
        setClaimPopupOpen(true);
        break;
      case StreamActionType.Cancel:
        setCancelPopupOpen(true);
        break;
      case StreamActionType.ClaimAfterCancel:
        setClaimAfterCancelPopupOpen(true);
        break;
    }
  };

  const disabledActions = {
    [StreamActionType.Claim]: streamStatus === StreamStatus.Finished || streamStatus === StreamStatus.Pending,
    [StreamActionType.Cancel]:
      !data?.stream?.can_cancel ||
      streamStatus === StreamStatus.Finished ||
      streamStatus === StreamStatus.Settled ||
      streamStatus === StreamStatus.Canceled,
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
      type: StreamActionType.Cancel,
      title: "Cancel stream",
      description: "Cancellation is a permanent action, and any unstreamed funds will be returned to the sender.",
      Icon: XCircleIcon,
      buttonLabel: "Cancel",
      disabled: disabledActions[StreamActionType.Cancel],
    },
    {
      type: StreamActionType.RenounceCancelStream,
      title: "Renounce cancelability",
      description:
        "Renouncing cancelability ensures that 100% of the funds will ultimately be delivered to the recipient.",
      Icon: HandRaisedIcon,
      buttonLabel: "Renounce",
      disabled: true,
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
              streamStatus === StreamStatus.Canceled ? setClaimAfterCancelPopupOpen(true) : setClaimPopupOpen(true)
            }
            disabled={disabledActions[StreamActionType.Claim]}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Withdraw
          </button>
          <button
            className="stream-action-button"
            onClick={() => setCancelPopupOpen(true)}
            disabled={disabledActions[StreamActionType.Cancel]}
          >
            <XCircleIcon className="w-5 h-5 mr-2" />
            Cancel stream
          </button>
          <button className="stream-action-button" onClick={() => setMoreActionsPopup(true)}>
            <EllipsisHorizontalIcon className="w-5 h-5 mr-2" />
            More options
          </button>
        </div>
      </div>

      <ClaimPopup data={data} open={claimPopupOpen} onClose={onClaimPopupClose} streamRecipient={streamRecipient} />
      <CancelPopup data={data} open={cancelPopupOpen} onClose={onCancelPopupClose} streamRecipient={streamRecipient} />
      <ClaimAfterCancelPopup
        data={data}
        open={claimAfterCancelPopupOpen}
        onClose={onClaimAfterCancelPopupClose}
        streamRecipient={streamRecipient}
      />

      <MoreActionsPopup open={moreActionsPopup} onClose={onMoreActionsPopupClose} items={allActionsList} />
    </>
  );
}
