import moment from "moment";
import { IStreamResource, StreamStatus } from "../types";
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

export const getStreamStatusListing = (stream: IStreamResource): StreamStatus => {
  const startTime = moment();
  if (moment() < startTime) return StreamStatus.Pending;

  const endTime = moment(stream.end_time);
  if (moment() < endTime) return StreamStatus.InProgress;

  if (stream.remaining_balance === "0") return StreamStatus.Finished;

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
    value: denominate(claimedAmount, 5, tokenMetadata?.decimals || 9).toNumber(),
    percent,
  };
};

export const getAmountStreamed = (data: IStreamResource, tokenMetadata: CoinMetadata): { value: number; percent: string } => {
  const currentTime = new Date().getTime();
  const startTime = data.start_time;
  const endTime = data.end_time;
  const percent = Math.min(((currentTime - startTime) / (endTime - startTime)), 1);
  const value = parseInt(data.amount) * percent;

  return {
    value: denominate(Math.min(value, parseInt(data.amount)), 5, tokenMetadata?.decimals || 9).toNumber(),
    percent: (percent * 100).toFixed(0),
  };
};
