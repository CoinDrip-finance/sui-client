import { Dialog } from '@headlessui/react';

import Popup from './shared/Dialog';

interface PopupProps {
  qrCode: string;
  uri: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function WalletConnectLoginPopup({ qrCode, uri, open, setOpen }: PopupProps) {
  const platform = require("platform");
  const isMobile = platform?.os?.family === "iOS" || platform?.os?.family === "Android";

  return (
    <Popup open={open} setOpen={setOpen}>
      <div className="flex flex-col items-center bg-neutral-900">
        <Dialog.Title as="h3" className="text-xl text-white">
          Scan QR code using xPortal
        </Dialog.Title>
        <div className="w-60 h-60 mt-6" dangerouslySetInnerHTML={{ __html: qrCode }} />
        <div className="flex items-center space-x-8 mt-6">
          {isMobile ? (
            <a href={uri} className="auth-button px-8 text-sm" rel="noopener noreferrer nofollow" target="_blank">
              Login with xPortal
            </a>
          ) : null}
          <button
            className="auth-button px-8 text-sm"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Popup>
  );
}
