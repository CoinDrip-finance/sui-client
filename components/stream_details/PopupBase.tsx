import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useMemo, useState } from 'react';

interface StreamDetailsBasePopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  children: any;
  title: string;
  hideSubmitButton?: boolean;
  submitButtonLabel?: string;
}

export default function StreamDetailsBasePopup({
  open,
  onClose,
  onSubmit,
  title,
  hideSubmitButton,
  submitButtonLabel,
  children,
}: StreamDetailsBasePopupProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
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
              <Dialog.Panel className="relative transform rounded-lg bg-neutral-900 p-8 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-xl">
                <div>
                  <Dialog.Title as="h3" className="text-xl font-medium mb-8">
                    {title}
                  </Dialog.Title>
                  {children}
                </div>
                <div className="mt-16 flex items-center justify-end space-x-6">
                  <button type="button" className="text-neutral-600" onClick={onClose}>
                    Cancel
                  </button>

                  {onSubmit && (
                    <button
                      type="button"
                      className="auth-button py-2 px-6 disabled:cursor-not-allowed disabled:bg-neutral-500"
                      onClick={onSubmit}
                      disabled={hideSubmitButton}
                    >
                      {submitButtonLabel}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
