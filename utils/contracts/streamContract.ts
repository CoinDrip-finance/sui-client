import { Aggregator } from '@ashswap/ash-sdk-js/out';
import { Address, BigUIntValue, BooleanValue, TokenTransfer, U64Value } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';

import { chainId, contractAddress, streamsNftCollection } from '../../config';
import { CreateStreamPayment } from '../../types';
import coindripAbi from '../coindrip.abi.json';
import { Segments } from '../models/Segments';
import Contract from './contract';

class StreamingContract extends Contract<typeof coindripAbi> {
  sender?: Address;
  constructor(sender?: string) {
    super(contractAddress, coindripAbi);

    if (sender) this.sender = new Address(sender);
  }

  createStreamNow(
    recipient: string,
    segments: Segments,
    cliff: number,
    canCancel: boolean,
    payment: CreateStreamPayment
  ) {
    const params = [new Address(recipient), segments.toList(), new U64Value(cliff), new BooleanValue(canCancel)];
    let interaction = this.contract.methods.createStreamNow(params);
    if (payment.token_identifier === "EGLD") {
      interaction.withValue(TokenTransfer.egldFromAmount(payment.amount));
    } else {
      interaction.withSingleESDTTransfer(
        TokenTransfer.fungibleFromAmount(payment.token_identifier, payment.amount, payment.decimals!)
      );
    }

    return this.interceptInteraction(interaction, 20_000_000);
  }

  async getStream(streamId: number) {
    const interaction = this.contract.methods.getStreamData([new U64Value(streamId)]);
    const queryResponse = await this.runQuery(interaction);

    return queryResponse.firstValue?.valueOf();
  }

  async getStreamedAmount(streamId: number) {
    const interaction = this.contract.methods.streamedAmount([new U64Value(streamId)]);
    const queryResponse = await this.runQuery(interaction);

    return queryResponse.firstValue?.valueOf();
  }

  async getRecipientBalance(streamId: number) {
    const interaction = this.contract.methods.recipientBalance([new U64Value(streamId)]);
    const queryResponse = await this.runQuery(interaction);

    return queryResponse.firstValue?.valueOf();
  }

  claimStream(streamId: number) {
    if (!this.sender) throw Error("No sender set in the constructor");
    const params = [new U64Value(streamId)];
    const interaction = this.contract.methods
      .claimFromStream(params)
      .withSingleESDTNFTTransfer(TokenTransfer.nonFungible(streamsNftCollection, streamId))
      .withSender(this.sender);

    return this.interceptInteraction(interaction, 50_000_000);
  }

  async claimStreamSwap(streamId: number, fromToken: string, toToken: string, amount: string) {
    if (!this.sender) throw Error("No sender set in the constructor");
    // @ts-ignore
    const agService = new Aggregator({ chainId });
    const exchangeAmount = new BigNumber(amount);
    const ashInteraction = await agService.aggregate(fromToken, toToken, exchangeAmount.toNumber(), 500);

    const params = [
      new U64Value(streamId),
      new BigUIntValue(exchangeAmount),
      ...ashInteraction.getArguments().slice(0, 2),
    ];

    const interaction = this.contract.methods
      .claimFromStreamSwap(params)
      .withSingleESDTNFTTransfer(TokenTransfer.nonFungible(streamsNftCollection, streamId))
      .withSender(this.sender);

    return this.interceptInteraction(interaction, 100_000_000);
  }

  cancelStream(streamId: number, withNftTransfer = false) {
    if (!this.sender) throw Error("No sender set in the constructor");
    const params = [new U64Value(streamId)];
    let interaction = this.contract.methods.cancelStream(params);

    if (withNftTransfer) {
      interaction
        .withSingleESDTNFTTransfer(TokenTransfer.nonFungible(streamsNftCollection, streamId))
        .withSender(this.sender);
    }

    return this.interceptInteraction(interaction, 50_000_000);
  }

  claimAfterCancel(streamId: number, withNftTransfer = false) {
    if (!this.sender) throw Error("No sender set in the constructor");
    const params = [new U64Value(streamId)];
    let interaction = this.contract.methods.claimFromStreamAfterCancel(params);

    if (withNftTransfer) {
      interaction
        .withSingleESDTNFTTransfer(TokenTransfer.nonFungible(streamsNftCollection, streamId))
        .withSender(this.sender);
    }

    return this.interceptInteraction(interaction, 50_000_000);
  }
}

export default StreamingContract;
