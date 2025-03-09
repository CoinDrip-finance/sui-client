import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import axios from "axios";
import { useMemo, useState } from "react";
import { IStreamResource } from "../../types";
import { classNames } from "../../utils/presentation";
import StreamsTable from "./StreamsTable";
import useSWRInfinite from 'swr/infinite';
import stream from "../../pages/api/stream";
import { start } from "repl";

export default function IncomingStreams() {
    const account = useCurrentAccount();
    const address = account?.address;
    const [cursor, setCursor] = useState<string | null | undefined>(null);

    const { data, isLoading } = useSuiClientQuery(
        'getOwnedObjects',
        {
            cursor,
            owner: address!,
            filter: {
                StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::${process.env.NEXT_PUBLIC_STREAM_STRUCT}`,
            },
            options: {
                showContent: true,
            },
        },
        {
            enabled: !!account,
        }
    );

    const nextCursor = useMemo(() => {
        return data?.nextCursor;
    }, [data]);

    const streams = useMemo<any[]>(() => {
        return data?.data?.map(e => {
            return {
                stream_id: e.data?.objectId,
                // @ts-ignore
                sender: e.data?.content?.fields?.sender,
                // @ts-ignore
                amount: e.data?.content?.fields?.initial_deposit,
                // @ts-ignore
                start_time: e.data?.content?.fields?.start_time,
                // @ts-ignore
                end_time: e.data?.content?.fields?.end_time,
                // @ts-ignore
                token: e.data?.content?.fields?.token,
                // @ts-ignore
                cliff: e.data?.content?.fields?.cliff,
                segments: [],
                // @ts-ignore
                createdAt: e.data?.fields?.start_time,
                // @ts-ignore
                remaining_balance: e.data?.content?.fields?.balance,
            }
        }) || [];
    }, [data]);

    const isLoadingMore = isLoading;
    const isEmpty = data?.data.length === 0;
    const isReachingEnd = isEmpty || !data?.hasNextPage;

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
                        onClick={() => setCursor(nextCursor)}
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