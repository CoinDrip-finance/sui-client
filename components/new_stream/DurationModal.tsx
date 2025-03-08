import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import { Fragment, useEffect, useMemo, useState } from 'react';

interface DurationModalProps {
  open: boolean;
  onClose: (duration?: number) => void;
}

interface SuggestedItem {
  label: string;
  duration: number;
}

const suggested: SuggestedItem[] = [
  { label: "2 years", duration: 6.312e7 },
  { label: "1 year", duration: 3.156e7 },
  { label: "6 months", duration: 1.577e7 },
  {
    label: "30 days",
    duration: 2.592e6,
  },
  { label: "1 day", duration: 86400 },
];

export default function DurationModal({ open, onClose }: DurationModalProps) {
  const [customDurationYears, setCustomDurationYears] = useState<number>();
  const [customDurationDays, setCustomDurationDays] = useState<number>();
  const [customDurationHours, setCustomDurationHours] = useState<number>();

  const [customDuration, setCustomDuration] = useState<number>(0);

  useEffect(() => {
    const years = customDurationYears || 0;
    const days = customDurationDays || 0;
    const hours = customDurationHours || 0;

    const duration = years * 3.156e7 + days * 86400 + hours * 3600;
    setCustomDuration(duration);
  }, [customDurationYears, customDurationDays, customDurationHours]);

  const customFinishDate = useMemo(() => {
    if (customDuration <= 0) return "";

    return moment().add(customDuration, "seconds").format("MMM Do 'YY @ H a");
  }, [customDuration]);

  const closeWrapper = (duration?: number) => {
    setCustomDurationYears(0);
    setCustomDurationDays(0);
    setCustomDurationHours(0);
    setCustomDuration(0);
    onClose(duration);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-900 px-8 py-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl">
                <div>
                  <div className="">
                    <Dialog.Title as="h3" className="text-xl font-medium">
                      Choose duration
                    </Dialog.Title>
                    {/* Suggested duration */}
                    <div className="mt-6">
                      <h4 className="text-neutral-600">Suggested</h4>
                      <ul className="sm:flex items-center justify-between sm:space-x-4 mt-3 grid grid-cols-2 gap-4 sm:gap-0">
                        {suggested.map((item) => (
                          <li
                            key={item.label}
                            className="rounded-lg border border-neutral-800 px-4 py-2 font-medium text-sm cursor-pointer hover:border-primary transition ease-in-out"
                            onClick={() => closeWrapper(item.duration)}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Custom duration */}
                    <div className="mt-6">
                      <h4 className="text-neutral-600">Custom duration</h4>
                      <ul className="flex items-center justify-between space-x-4 mt-3">
                        <div className="relative flex-1">
                          <div className="absolute right-3 text-sm text-light mt-3 text-neutral-500">years</div>
                          <input
                            type="number"
                            className="bg-neutral-900 rounded-lg border border-neutral-800 focus:border-neutral-800 h-12 font-medium text-sm focus:outline-none px-4 w-full"
                            onChange={({ target: { valueAsNumber } }) => {
                              setCustomDurationYears(valueAsNumber);
                            }}
                          />
                        </div>
                        <div className="relative flex-1">
                          <div className="absolute right-3 text-sm text-light mt-3 text-neutral-500">days</div>
                          <input
                            type="number"
                            className="bg-neutral-900 rounded-lg border border-neutral-800 focus:border-neutral-800 h-12 font-medium text-sm focus:outline-none px-4 w-full"
                            onChange={({ target: { valueAsNumber } }) => {
                              setCustomDurationDays(valueAsNumber);
                            }}
                          />
                        </div>
                        <div className="relative flex-1">
                          <div className="absolute right-3 text-sm text-light mt-3 text-neutral-500">hours</div>
                          <input
                            type="number"
                            className="bg-neutral-900 rounded-lg border border-neutral-800 focus:border-neutral-800 h-12 font-medium text-sm focus:outline-none px-4 w-full"
                            onChange={({ target: { valueAsNumber } }) => {
                              setCustomDurationHours(valueAsNumber);
                            }}
                          />
                        </div>
                      </ul>
                    </div>

                    {customFinishDate && (
                      <div className="mt-6">
                        <div className="text-neutral-600">Estimate starting now</div>
                        <div>The stream would end on {customFinishDate}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-16 flex items-center justify-end space-x-6">
                  <button type="button" className="text-neutral-600" onClick={() => closeWrapper()}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="auth-button py-2 px-6"
                    onClick={() => closeWrapper(customDuration || 0)}
                  >
                    Confirm duration
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
