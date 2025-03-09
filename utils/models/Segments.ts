import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import BigNumber from 'bignumber.js';

import { ICreateStream, ISegment } from '../../types';

BigNumber.config({ EXPONENTIAL_AT: 19 });

export class Segments {
  private segments: ISegment[] = [];

  constructor(segment?: ISegment) {
    if (segment) {
      this.segments.push(segment);
    }
  }

  add(segment: ISegment) {
    this.segments.push(segment);
  }

  valueOf() {
    return this.segments;
  }

  private makeSegment(tx: Transaction, amount: string, exponent: number, duration: number): TransactionArgument {
    return tx.moveCall({
      target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::new_segment`,
      arguments: [tx.pure.u64(amount), tx.pure.u8(exponent), tx.pure.u64(duration * 1000)],
    });
  }

  toVector(tx: Transaction) {
    const segments = this.segments.map((segment) => this.makeSegment(tx, segment.amount, segment.exponent, segment.duration));
    return tx.makeMoveVec({ elements: segments, type: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::Segment` })
  }

  static fromNewStream(streamData: ICreateStream, amount: BigNumber): Segments {
    const segmentsCount: number = streamData.steps_count!;
    const segmentDuration = Math.floor(streamData.duration / segmentsCount);
    const segmentDurationError = streamData.duration - segmentDuration * segmentsCount;

    const segmentAmount = amount.div(segmentsCount).integerValue(BigNumber.ROUND_DOWN);
    const segmentAmountError = amount.minus(segmentAmount.times(segmentsCount));

    const segments = new Segments();

    for (let i = 1; i <= segmentsCount; i++) {
      segments.add({
        duration: segmentDuration - 1,
        amount: "0",
        exponent: 1,
      });

      if (i === segmentsCount) {
        segments.add({
          duration: 1 + segmentDurationError,
          amount: segmentAmount.plus(segmentAmountError).toString(),
          exponent: 1,
        });
      } else {
        segments.add({
          duration: 1,
          amount: segmentAmount.toString(),
          exponent: 1,
        });
      }
    }

    return segments;
  }
}
