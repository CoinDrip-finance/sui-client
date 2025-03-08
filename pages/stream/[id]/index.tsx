import { useAuth } from '@elrond-giants/erd-react-hooks';
import { ParentSize } from '@visx/responsive';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import BackButtonWrapper from '../../../components/shared/BackWrapper';
import Layout from '../../../components/shared/Layout';
import Nft from '../../../components/stream_details/Nft';
import Overview from '../../../components/stream_details/Overview';
import SenderRecipientDetails from '../../../components/stream_details/SenderRecipient';
import StreamActions from '../../../components/stream_details/StreamActions';
import StreamChart from '../../../components/stream_details/StreamChart';
import StreamProgressBars from '../../../components/stream_details/StreamProgressBars';
import StreamProps from '../../../components/stream_details/StreamProps';
import { network } from '../../../config';
import { useTransaction } from '../../../hooks/useTransaction';
import { IStreamResponse } from '../../../types';
import { homePath } from '../../../utils/routes';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

import type { NextPage } from "next";
const StreamDetails: NextPage = () => {
  const { address, logout, balance, nonce } = useAuth();
  const { makeTransaction } = useTransaction();
  const router = useRouter();
  const [paymentTokenImage, setPaymentTokenImage] = useState<string>();

  const { data, isLoading, error, mutate } = useSWR<IStreamResponse>(`/api/stream/${router.query.id}`, fetcher, {
    refreshInterval: 1000 * 60,
  });

  useEffect(() => {
    if (isLoading) return;
    if (error) router.push(homePath);
    if (!data) router.push(homePath);
  }, [data, isLoading, error]);

  useEffect(() => {
    if (!data?.stream?.payment?.token_identifier) return;
    if (data?.stream?.payment?.token_identifier === "EGLD") {
      setPaymentTokenImage("/new_stream/egld_icon.png");
      return;
    }
    (async () => {
      const { data: tokenData } = await axios.get(
        `${network.apiAddress}/tokens/${data?.stream?.payment?.token_identifier}`
      );

      setPaymentTokenImage(tokenData?.assets?.svgUrl || tokenData?.assets?.pngUrl);
    })();
  }, [data?.stream?.payment?.token_identifier]);

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
        title={`Stream #${data.id}`}
        openGraph={{
          images: [
            {
              url: `https://devnet-v2.coindrip.finance/api/stream/${data.id}/og-image`,
              width: 1200,
              height: 650,
              type: "image/png",
            },
          ],
        }}
      />
      <BackButtonWrapper href={homePath} size="max-w-screen-md">
        <Overview data={data} tokenIcon={paymentTokenImage} />

        <SenderRecipientDetails data={data} />

        <StreamProps data={data} />

        <StreamProgressBars data={data} />

        <StreamActions data={data} refresh={mutate} />

        <ParentSize>{({ width, height }) => <StreamChart width={width} height={300} stream={data} />}</ParentSize>

        <Nft data={data} />
      </BackButtonWrapper>
    </Layout>
  );
};

export default StreamDetails;
