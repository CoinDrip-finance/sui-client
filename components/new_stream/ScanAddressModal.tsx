import { Dialog, Transition } from '@headlessui/react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Fragment, useEffect, useMemo, useState } from 'react';

interface DurationModalProps {
  open: boolean;
  onClose: (address?: string) => void;
}

export default function ScanAddressModal({ open, onClose }: DurationModalProps) {
  const closeWrapper = (address?: string) => {
    if (address?.startsWith("erd1")) onClose(address);
    else if (address?.startsWith("multiversx:erd1")) {
      const parsedAddress = address.replace("multiversx:", "").slice(0, 62);
      onClose(parsedAddress);
    } else {
      onClose();
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={() => closeWrapper()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-950 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-900 px-8 py-6 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl">
                <div>
                  <div className="">
                    <Dialog.Title as="h3" className="text-xl font-medium mb-8">
                      Scan Wallet QR
                    </Dialog.Title>

                    <QrScanner
                      onDecode={(result) => closeWrapper(result)}
                      onError={(error) => console.log(error?.message)}
                    />
                  </div>
                </div>
                <div className="mt-16 flex items-center justify-end space-x-6">
                  <button type="button" className="text-neutral-600" onClick={() => closeWrapper()}>
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
