export interface CreateStreamPayment {
  token_identifier: string;
  amount: number;
  decimals?: number;
}

export interface ICreateStream {
  amount: number;
  duration: number;
  payment_token: string;
  recipient: string;
  can_cancel: boolean;
  cliff?: number;
  steps_count?: number;
}

export enum StreamType {
  Linear = "linear",
  CliffLinear = "cliff_linear",
  Steps = "steps",
  Exponential = "exponential",
  CliffExponential = "cliff_exponential",
}

export type StreamResourceStatus = "active" | "finalized" | "cancelled";

export enum StreamStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Canceled = "Canceled",
  Settled = "Settled",
  Finished = "Finished",
}

export interface IStreamResource {
  dbld?: string;
  stream_id: string;
  sender: string;
  amount: string;
  start_time: number;
  end_time: number;
  token: string;
  cliff: string;
  segments: ISegment[];
  createdAt?: Date;
  remaining_balance: string;
  claims?: IClaimResource[];
}

interface IStreamFieldsSegment {
  type: string;
  fields: {
    amount: string;
    exponent: number;
    duration: string;
  }
}

export interface IStreamFields {
  balance: string;
  cliff: string;
  end_time: string;
  id: {
    id: string;
  };
  image_url: string;
  initial_deposit: string;
  name: string;
  segments: IStreamFieldsSegment[];
  sender: string;
  start_time: string;
  token: string;
}

export interface IClaimResource {
  dbld: string
  stream_id: string;
  claimed_by: string;
  amount: string;
  remaining_balance: string;
  createdAt: Date;
}

export interface IStreamResponse {
  id: number;
  status: string;
  created_at: string;
  tx_hash: string;
  stream: {
    sender: string;
    last_claim_by?: string;
    payment: {
      token_identifier: string;
      token_name: string;
      token_nonce: number;
      token_decimals: number;
      amount: string;
      amount_with_fees: string;
    };
    start_time: string;
    end_time: string;
    can_cancel: boolean;
    cliff: number;
    balance?: {
      streamed_amount: string;
      claimed_amount: string;
      balances_after_cancel?: {
        sender_balance: string;
        recipient_balance: string;
      };
      recipient_balance?: string;
      streamed_until_cancel?: string;
    };
    segments: ISegment[];
  };
  nft?: {
    collection: string;
    nonce: number;
    identifier: string;
    name: string;
    url: string;
  };
}

export interface ISegment {
  amount: string;
  exponent: number;
  duration: string;
}

export interface IChartSegment extends ISegment {
  startDate: moment.Moment;
  endDate: moment.Moment;
  startAmount: number;
  endAmount: number;
  denominatedAmount: number;
}
