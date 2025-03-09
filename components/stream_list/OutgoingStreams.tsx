import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import axios from "axios";
import { useMemo } from "react";
import { IStreamResource } from "../../types";
import { classNames } from "../../utils/presentation";
import StreamsTable from "./StreamsTable";
import useSWRInfinite from 'swr/infinite';

const PAGE_SIZE = 6;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const encodeParams = (params: any) => new URLSearchParams(params).toString();

export default function OutgoingStreams() {
  const account = useCurrentAccount();
  const address = account?.address;

  const { data, size, setSize, isLoading } = useSWRInfinite<IStreamResource[]>(
    (index) =>
      `/api/stream?${encodeParams({
        address,
        page: index,
        page_size: PAGE_SIZE,
      })}`,
    fetcher
  );

  const streams: IStreamResource[] = data ? ([] as IStreamResource[]).concat(...data) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col items-start space-y-2 max-w-screen-lg w-full mx-auto">
        <StreamsTable streams={streams} />

        {isLoading ? (
          <div className="text-center py-8 border-2 border-neutral-900 rounded-lg w-full flex justify-center">
            <img src="/stream_details/loading.gif" alt="Loading stream" className="h-28 pointer-events-none" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-8 border-2 border-neutral-900 text-neutral-700 bg-neutral-900 bg-opacity-10 rounded-lg w-full">
            No results found
          </div>
        ) : (
          <button
            disabled={isLoadingMore || isReachingEnd}
            onClick={() => setSize(size + 1)}
            className={classNames(
              !(isLoadingMore || isReachingEnd) ? "underline" : " text-neutral-400",
              "mx-auto font-light pt-2"
            )}
          >
            {isLoadingMore ? "Loading streams..." : isReachingEnd ? "No more streams" : "Load more"}
          </button>
        )}
      </div>
    </div>
  );
}