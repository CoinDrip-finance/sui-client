import axios from "axios";
import BigNumber from "bignumber.js";
import moment from "moment";

import { network } from "../config";
import { IStreamFields, IStreamResource, IStreamResponse, StreamStatus } from "../types";
import { denominate } from "./economics";
import { CoinMetadata } from "@mysten/sui/dist/cjs/client";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function getShortAddress(address: string, chars = 4): string {
  return address.substring(0, chars) + "..." + address.substring(address.length - chars);
}

export function extractTokenName(input: string): string {
  // Check if input is a non-empty string
  if (typeof input !== 'string' || input.trim() === '') {
    return '';
  }

  // Split by '::' and take the last element
  const segments = input.split('::');
  return segments[segments.length - 1] || '';
}

export async function getHerotag(address: string): Promise<string | undefined> {
  const { data } = await axios.get(`${network.apiAddress}/accounts/${address}`);
  return data?.username;
}

export const getStreamStatusListing = (stream: IStreamResource): StreamStatus => {
  const startTime = moment(stream.start_time);
  if (moment() < startTime) return StreamStatus.Pending;

  const endTime = moment(stream.end_time);
  if (moment() < endTime) return StreamStatus.InProgress;

  if (stream.remaining_balance === "0") return StreamStatus.Finished;

  return StreamStatus.Settled;
};

export const getStreamStatusDetails = (stream: IStreamResponse): StreamStatus => {
  if (stream.status === "finalized") return StreamStatus.Finished;

  if (stream.status === "cancelled") return StreamStatus.Canceled;

  const startTime = moment(stream.stream.start_time);
  if (moment() < startTime) return StreamStatus.Pending;

  const endTime = moment(stream.stream.end_time);
  if (moment() < endTime) return StreamStatus.InProgress;

  return StreamStatus.Settled;
};

export const getStreamStatus = (stream: IStreamResource): StreamStatus => {
  return getStreamStatusListing(stream as IStreamResource);
};

export const formatNumber = (num: number, precision = 2) => {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num;
};

export const getDepositAmount = (data: IStreamResource, tokenMetadata: CoinMetadata): number => {
  return denominate(data.amount, 5, tokenMetadata?.decimals || 9).toNumber();
};

export const getClaimedAmount = (data: IStreamResource, tokenMetadata: CoinMetadata): { value: number; percent: string } => {
  const deposit = parseInt(data.amount);
  const balance = parseInt(data?.remaining_balance || data.amount);
  const claimedAmount = deposit - balance;
  const percent = ((claimedAmount * 100) / deposit).toFixed(0);

  return {
    value: denominate(balance, 5, tokenMetadata.decimals).toNumber(),
    percent,
  };
};

export const getAmountStreamed = (data: IStreamResource): { value: number; percent: string } => {
  const currentTime = new Date().getTime();
  const startTime = parseInt(data.start_time);
  const endTime = parseInt(data.end_time);
  const percent = ((currentTime - startTime) / (endTime - startTime));
  const value = parseInt(data.amount) * percent;
  return {
    value: Math.min(value, parseInt(data.amount)),
    percent: (percent * 100).toFixed(0),
  };
};
