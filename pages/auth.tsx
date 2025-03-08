import { useAuth } from '@elrond-giants/erd-react-hooks';
import { AuthProviderType } from '@elrond-giants/erdjs-auth/dist/types';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

import WalletConnectLoginPopup from '../components/WalletConnectLoginPopup';
import * as config from '../config';
import { homePath } from '../utils/routes';

import type { NextPage } from "next";
const Auth: NextPage = () => {
  const { authenticated, login, getLedgerAccounts } = useAuth();
  const router = useRouter();
  const [maiarAuthUri, setMaiarAuthUri] = useState("");
  const [authQrCode, setAuthQrCode] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ledgerAccounts, setLedgerAccounts] = useState<string[]>([]);

  useEffect(() => {
    setShowPopup(!!(authQrCode && isPopupOpen));
  }, [authQrCode, isPopupOpen]);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    (async () => {
      await router.replace(homePath);
    })();
  }, [router, authenticated]);

  const walletConnectClickHandler = async () => {
    const uri = await login(AuthProviderType.WALLET_CONNECT);
    const qrCode = await QRCode.toString(uri, { type: "svg" });
    const authUri = `${config.walletConnectDeepLink}?wallet-connect=${encodeURIComponent(uri)}`;
    setAuthQrCode(qrCode);
    setMaiarAuthUri(authUri);
    setIsPopupOpen(true);
  };

  const webClickHandler = async () => {
    await login(AuthProviderType.WEBWALLET);
  };

  const extensionClickHandler = async () => {
    await login(AuthProviderType.EXTENSION);
  };

  const ledgerClickHandler = async () => {
    const accounts = await getLedgerAccounts();
    setLedgerAccounts(accounts);
  };

  const loginWithLedger = async (accountIndex: number) => {
    await login(AuthProviderType.LEDGER, { ledgerAccountIndex: accountIndex });
  };

  return (
    <>
      <div className="flex sm:h-screen">
        <img
          src="/bg-gradient.png"
          alt=""
          className="sm:hidden fixed top-0 rotate-180 inset-x-0 mx-auto pointer-events-none h-1/2 object-cover"
        />
        <div
          className="flex-1 hidden sm:block bg-cover bg-center relative"
          style={{
            backgroundImage: "url(/auth/bg.jpg)",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[black] opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full z-10 p-20 flex flex-col items-start justify-end space-y-10">
            <img src="/logo.svg" alt="Coindrip" className="h-12" />

            <p className="text-white font-medium text-4xl max-w-xl leading-tight">
              The protocol for real-time payments
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center h-screen">
          <div className="max-w-lg">
            <img src="/logo.svg" alt="Coindrip" className="h-10 mx-auto mb-24 sm:hidden" />
            <h1 className="text-white font-medium text-2xl sm:text-4xl mb-2 text-center">Connect your wallet</h1>
            <p className="text-gray-400 font-light mb-10 text-center">Pick a login method to access CoinDrip</p>
            <div className="flex flex-col max-w-xs mx-auto space-y-3 mb-24">
              <button type="button" className="auth-button" onClick={walletConnectClickHandler}>
                xPortal
              </button>
              <button type="button" className="auth-button" onClick={webClickHandler}>
                Web Wallet
              </button>
              <button type="button" className="auth-button" onClick={extensionClickHandler}>
                Extension
              </button>
              <p className="text-xs text-gray-400 text-center">* To use Ledger, please select Web Wallet.</p>
            </div>

            <div>
              <p className="text-white font-medium text-xl text-center">New to MultiversX?</p>
              <p className="text-gray-400 font-light text-base text-center mt-2 max-w-xs sm:max-w-none">
                Easily create your own MultiversX wallet using{" "}
                <a
                  href="https://xportal.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00FFF2] hover:underline"
                >
                  xPortal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <WalletConnectLoginPopup qrCode={authQrCode} uri={maiarAuthUri} open={showPopup} setOpen={setIsPopupOpen} />
    </>
  );
};

export default Auth;
