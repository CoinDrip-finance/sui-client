import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useMemo, useState } from "react";
import { classNames, getStreamStatus } from "../../utils/presentation";
import StreamsTable from "./StreamsTable";
import { SuiObjectResponse } from "@mysten/sui/dist/cjs/client";
import { StreamStatus } from "../../types";
import { Transaction } from '@mysten/sui/transactions';
import { forwardRef, useImperativeHandle } from 'react';
import { useTransaction } from "../../hooks/useTransaction";

const IncomingStreams = forwardRef((props, ref) => {
    const account = useCurrentAccount();
    const address = account?.address;
    const [cursor, setCursor] = useState<string | null | undefined>(null);
    const [streamList, setStreamList] = useState<SuiObjectResponse[]>([]);
    const { sendTransaction } = useTransaction();

    const { data, isLoading, refetch } = useSuiClientQuery(
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

    useEffect(() => {
        if (!address) return;

        setStreamList([]);
        refetch();
    }, [address]);

    useEffect(() => {
        if (data)
            setStreamList((prev) => {
                const streamsToPush = data.data.filter((e: any) => !prev.find((s) => s.data?.objectId === e.data?.objectId));
                return [...prev, ...streamsToPush];
            });
    }, [data]);

    const nextCursor = useMemo(() => {
        return data?.nextCursor;
    }, [data]);

    const streams = useMemo<any[]>(() => {
        return streamList?.map(e => {
            return {
                stream_id: e.data?.objectId as string,
                // @ts-ignore
                sender: e.data?.content?.fields?.sender,
                // @ts-ignore
                amount: e.data?.content?.fields?.initial_deposit,
                // @ts-ignore
                start_time: parseInt(e.data?.content?.fields?.start_time),
                // @ts-ignore
                end_time: parseInt(e.data?.content?.fields?.end_time),
                // @ts-ignore
                token: e.data?.content?.fields?.token,
                // @ts-ignore
                cliff: parseInt(e.data?.content?.fields?.cliff),
                segments: [],
                // @ts-ignore
                createdAt: parseInt(e.data?.content?.fields?.start_time),
                // @ts-ignore
                remaining_balance: e.data?.content?.fields?.balance,
            }
        }).map(e => {
            return {
                ...e,
                // @ts-ignore
                status: getStreamStatus(e),
            }
        }) || [];
    }, [streamList]);

    const isLoadingMore = isLoading;
    const isEmpty = data?.data.length === 0;
    const isReachingEnd = isEmpty || !data?.hasNextPage;

    const claimAll = async () => {
        if (!address) return;

        const tx = new Transaction();
        tx.setSender(account.address);
        tx.setGasBudget(50_000_000);

        const coins: any[] = [];

        streams.forEach((stream) => {
            const [coin] = tx.moveCall({
                target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::claim_from_stream`,
                typeArguments: [stream.token],
                arguments: [
                    tx.object(stream.stream_id),
                    tx.object("0x6")
                ]
            });

            coins.push(coin);

            if (stream.status === StreamStatus.Settled) {
                tx.moveCall({
                    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::destroy_zero`,
                    typeArguments: [stream.token],
                    arguments: [
                        tx.object(stream.stream_id),
                    ]
                });
            }
        });

        tx.transferObjects(coins, account.address);

        await sendTransaction(tx);
    }

    useImperativeHandle(ref, () => ({
        triggerChildFunction: claimAll,
    }));

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
});

IncomingStreams.displayName = 'ChildComponent';

export default IncomingStreams;