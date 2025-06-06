import "../styles/globals.scss";
import '@mysten/dapp-kit/dist/index.css';
import "@assistant-ui/react-ui/styles/index.css";
import "@assistant-ui/react-ui/styles/modal.css";

import { DefaultSeo } from "next-seo";
import { Poppins } from "next/font/google";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { createNetworkConfig, SuiClientProvider, WalletProvider, lightTheme } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import Notifications from "../components/Notifications";
import store from "../redux/store";

const poppinsFont = Poppins({
  display: "swap",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

const ChatProvider = dynamic(
  () => import('../components/ChatProvider'),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const { networkConfig, network } = getNetworkConfig();
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <DefaultSeo
        titleTemplate="%s | Coindrip"
        defaultTitle="Coindrip"
        description="The token streaming protocol that facilitates web3 real-time payments, serving the needs of DAOs and businesses for tasks such as vesting, payroll, airdrops, and more."
        openGraph={{
          images: [
            {
              url: "https://devnet.coindrip.finance/og-image.jpg",
              width: 2400,
              height: 1350,
              type: "image/jpeg",
            },
          ],
          siteName: "Coindrip",
        }}
        twitter={{
          handle: "@CoinDripHQ",
          cardType: "summary_large_image",
        }}
      />

      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider
            networks={networkConfig}
            defaultNetwork={network}
          >
            <WalletProvider
              theme={lightTheme}
              autoConnect={true}
            >

              <ChatProvider>
                <div className={poppinsFont.className}>
                  <Component {...pageProps} />
                  <Notifications />
                </div>
              </ChatProvider>

            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </>
  );
}

export default MyApp;

function getNetworkConfig() {
  let network: 'mainnet' | 'devnet' | 'testnet' = 'testnet';
  if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') {
    network = 'mainnet';
  }
  const { networkConfig } = createNetworkConfig({
    [network]: { url: getFullnodeUrl(network) },
  });

  return { networkConfig, network };
}
