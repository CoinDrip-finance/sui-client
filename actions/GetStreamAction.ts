import axios from 'axios';
import BigNumber from 'bignumber.js';
import { NextApiRequest } from 'next';

import { nonceToHex } from '../apis/nfts';
import { ClaimsRepository } from '../repositories/ClaimsRepository';
import { StreamsRepository } from '../repositories/StreamsRepository';
import { IStreamResponse } from '../types';
import StreamingContract from '../utils/contracts/streamContract';
import { network, streamsNftCollection } from './../config';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

const getStreamNft = async (nonce: number) => {
  const { data } = await axios.get(`${network.apiAddress}/nfts/${streamsNftCollection}-${nonceToHex(nonce)}`);

  return { name: data.name, url: data.url, identifier: data.identifier };
};

export default class GetStreamAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<IStreamResponse>> {
    const id: string = req.query.id as string;

    const streamsRepository = new StreamsRepository();
    const { data: streamFromDb } = await streamsRepository.findById(id);

    const claimsRepository = new ClaimsRepository();
    const { data: claims } = await claimsRepository.getClaimsByStream(streamFromDb?.id as number);

    const claimed_amount = claims?.reduce(
      (accumulator: BigNumber, currentValue: any) => accumulator.plus(new BigNumber(currentValue.amount)),
      new BigNumber(0)
    );

    let response: IStreamResponse = {
      id: streamFromDb?.id!,
      status: streamFromDb?.status!,
      created_at: streamFromDb?.created_at!,
      tx_hash: streamFromDb?.tx_hash!,
      stream: {
        sender: streamFromDb?.sender!,
        last_claim_by: claims?.[0]?.recipient,
        payment: {
          token_identifier: streamFromDb?.payment_token!,
          token_name: streamFromDb?.payment_token_label!,
          token_nonce: streamFromDb?.payment_nonce!,
          token_decimals: streamFromDb?.decimals!,
          amount: streamFromDb?.deposit!,
          amount_with_fees: streamFromDb?.deposit_with_fees!,
        },
        start_time: streamFromDb?.start_time!,
        end_time: streamFromDb?.end_time!,
        can_cancel: streamFromDb?.can_cancel!,
        cliff: streamFromDb?.cliff!,
        segments: JSON.parse(streamFromDb?.segments),
      },
    };

    if (streamFromDb?.status !== "finalized") {
      try {
        const streamNftData = await getStreamNft(streamFromDb?.stream_nft_nonce as number);

        response.nft = {
          collection: streamFromDb?.stream_nft_identifier!,
          nonce: streamFromDb?.stream_nft_nonce!,
          identifier: streamNftData.identifier,
          name: streamNftData.name,
          url: streamNftData.url,
        };
      } catch (e) {}

      const streamContract = new StreamingContract();
      const streamedAmount = await streamContract.getStreamedAmount(streamFromDb?.id as number);
      const streamFromSc = await streamContract.getStream(streamFromDb?.id as number);
      const recipientBalance = await streamContract.getRecipientBalance(streamFromDb?.id as number);

      response.stream.balance = {
        streamed_amount: streamedAmount,
        claimed_amount: streamFromSc.claimed_amount,
        balances_after_cancel: streamFromSc.balances_after_cancel,
        recipient_balance: streamFromSc?.balances_after_cancel?.recipient_balance || recipientBalance,
      };
    } else {
      response.stream.balance = {
        streamed_amount: claimed_amount,
        claimed_amount,
      };
    }

    if (streamFromDb?.canceled?.streamed_until_cancel) {
      response.stream.balance.streamed_until_cancel = streamFromDb.canceled.streamed_until_cancel;
    }

    return new ApiResponse({
      body: response,
    }).cache(60, 6);
  }
}
