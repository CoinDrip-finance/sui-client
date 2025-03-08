import { useAuth } from "@elrond-giants/erd-react-hooks";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

import { fetchStreamNftsNonceList } from "../apis/nfts";
import Dropdown, { DropdownItem } from "../components/Dropdown";
import InfoCard from "../components/InfoCard";
import ActionButton from "../components/shared/ActionButton";
import Layout from "../components/shared/Layout";
import StreamsTable from "../components/stream_list/StreamsTable";
import { IStreamResource } from "../types";
import { classNames } from "../utils/presentation";
import { galleryPath } from "../utils/routes";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const PAGE_SIZE = 6;

const encodeParams = (params: any) => new URLSearchParams(params).toString();

const streamFilterOptions: DropdownItem[] = [
  { id: "all", label: "All Streams" },
  { id: "incoming", label: "Incoming" },
  { id: "outgoing", label: "Outgoing" },
];

import type { NextPage } from "next";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
const Home: NextPage = () => {
  const account = useCurrentAccount();
  const address = account?.address;
  const [selectedFilter, setSelectedFilter] = useState(streamFilterOptions[0]);

  const { data: streamNfts } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: address!,
      filter: {
        StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::${process.env.NEXT_PUBLIC_STREAM_STRUCT}`,
      },
      options: {
        showDisplay: true,
      },
    },
    {
      enabled: !!account,
    }
  );

  const streamNftIds = useMemo(() => {
    return streamNfts?.data.map(e => e.data?.objectId) || [];
  }, [streamNfts]);

  const filterParams = useMemo(() => {
    if (!address) return {};
    if (selectedFilter.id === "all") {
      return {
        address,
        nfts: streamNftIds,
      };
    }
    if (selectedFilter.id === "incoming") {
      return {
        nfts: streamNftIds,
      };
    }
    if (selectedFilter.id === "outgoing") {
      return {
        address,
      };
    }
  }, [address, streamNftIds, selectedFilter]);

  const { data, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite<IStreamResource[]>(
    (index) =>
      `/api/stream?${encodeParams({
        ...filterParams,
        page: index,
        page_size: PAGE_SIZE,
      })}`,
    fetcher
  );

  const streams: IStreamResource[] = data ? ([] as IStreamResource[]).concat(...data) : [];
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <Layout>
      <NextSeo title="Dashboard" />
      <div className="max-w-screen-lg w-full mx-auto sm:mt-20 mb-7 flex items-center justify-between">
        <div>
          <h1 className="font-medium text-2xl mb-1 sm:mb-3">Dashboard</h1>
          <Dropdown
            items={streamFilterOptions}
            selectedItem={selectedFilter}
            onChange={(newItem) => setSelectedFilter(newItem)}
          />
        </div>
        <ActionButton
          Icon={PlusSmallIcon}
          label="Create Stream"
          href={galleryPath}
          className="primary-action-button flex items-center"
        />
      </div>
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

      <div className="max-w-screen-lg mx-auto mt-16">
        <InfoCard showButton={isEmpty} />
      </div>
    </Layout>
  );
};

export default Home;
