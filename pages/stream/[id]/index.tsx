import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import BackButtonWrapper from '../../../components/shared/BackWrapper';
import Layout from '../../../components/shared/Layout';
import Overview from '../../../components/stream_details/Overview';
import SenderRecipientDetails from '../../../components/stream_details/SenderRecipient';
import { IStreamFields, IStreamResource } from '../../../types';
import { homePath } from '../../../utils/routes';

import type { NextPage } from "next";
import { useSuiClientQuery } from '@mysten/dapp-kit';
import useSWR from 'swr';
import StreamProps from '../../../components/stream_details/StreamProps';
import StreamProgressBars from '../../../components/stream_details/StreamProgressBars';
import { ParentSize } from '@visx/responsive';
import StreamChart from '../../../components/stream_details/StreamChart';
import Nft from '../../../components/stream_details/Nft';
import StreamActions from '../../../components/stream_details/StreamActions';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const StreamDetails: NextPage = () => {
  const router = useRouter();
  const [paymentTokenImage, setPaymentTokenImage] = useState<string>();

  const { data, isLoading, error, mutate } = useSWR<IStreamResource>(`/api/stream/${router.query.id}`, fetcher, {
    refreshInterval: 1000 * 60,
  });

  const { data: streamObject } = useSuiClientQuery(
    'getObject',
    {
      id: router.query.id as string,
      options: {
        showContent: true,
        showOwner: true,
      },
    },
  );

  const { data: coinMetadata } = useSuiClientQuery(
    'getCoinMetadata',
    {
      coinType: data?.token!,
    },
    {
      enabled: !!data?.token
    }
  );

  useEffect(() => {
    if (isLoading) return;
    if (error) router.push(homePath);
    if (!data) router.push(homePath);
  }, [data, isLoading, error]);

  useEffect(() => {
    setPaymentTokenImage(coinMetadata?.iconUrl!); // TODO: Maybe use a placeholder
  }, [coinMetadata]);

  const recipientAddress = useMemo<string>(() => {
    // @ts-ignore
    return streamObject?.data?.owner?.AddressOwner || data?.claims?.[0]?.claimed_by
  }, [data, streamObject]);

  if (isLoading) {
    return (
      <Layout>
        <BackButtonWrapper href={homePath}>
          <div className="flex justify-center py-8">
            <img src="/stream_details/loading.gif" alt="Loading stream" className="h-48" />
          </div>
        </BackButtonWrapper>
      </Layout>
    );
  }

  if (!data || error) {
    return (
      <Layout>
        <BackButtonWrapper href={homePath}>
          <div className="text-center text-4xl">Invalid stream...</div>
        </BackButtonWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <NextSeo
        title={`Stream #${data.stream_id}`}
        openGraph={{
          images: [
            {
              url: `https://devnet-v2.coindrip.finance/api/stream/${data.stream_id}/og-image`,
              width: 1200,
              height: 650,
              type: "image/png",
            },
          ],
        }}
      />
      <BackButtonWrapper href={homePath} size="max-w-screen-md">
        <Overview data={data} tokenMetadata={coinMetadata!} tokenIcon={paymentTokenImage} />

        <SenderRecipientDetails senderAddress={data.sender} recipientAddress={recipientAddress} />

        <StreamProps data={data} tokenMetadata={coinMetadata!} />

        <StreamProgressBars data={data} tokenMetadata={coinMetadata!} />

        <StreamActions data={data} tokenMetadata={coinMetadata!} streamRecipient={recipientAddress} refresh={mutate} />

        <ParentSize>{({ width, height }) => <StreamChart width={width} height={300} stream={data} tokenMetadata={coinMetadata!} />}</ParentSize>

        <Nft data={data} />
      </BackButtonWrapper>
    </Layout>
  );
};

export default StreamDetails;
