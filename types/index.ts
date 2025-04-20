export interface ICreateStreamItem {
  amount: number;
  duration: number;
  recipient: string;
  cliff?: number;
  steps_count?: number;
}

export interface ICreateStream {
  payment_token: string;
  streams: ICreateStreamItem[];
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
  status?: StreamStatus;
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

export interface ISegment {
  amount: string;
  exponent: number;
  duration: number;
}

export interface IChartSegment extends ISegment {
  startDate: moment.Moment;
  endDate: moment.Moment;
  startAmount: number;
  endAmount: number;
  denominatedAmount: number;
}
