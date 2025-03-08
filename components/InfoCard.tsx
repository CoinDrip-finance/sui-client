import { PlusSmallIcon } from '@heroicons/react/20/solid';

import { classNames } from '../utils/presentation';
import { galleryPath } from '../utils/routes';
import ActionButton from './shared/ActionButton';

interface InfoCardProps {
  showButton?: boolean;
}

export default function InfoCard({ showButton }: InfoCardProps) {
  return (
    <div className="p-7 bg-neutral-950 border border-neutral-900 rounded-lg relative overflow-hidden">
      <div className="font-medium text-xl mb-2">We know how important is to get paid on time.</div>
      <div className="text-light text-sm text-neutral-300 w-2/3 sm:w-full">
        With Coindrip, on time means <span className="text-primary">every second.</span>
      </div>
      <div className="flex items-center space-x-6 mt-6">
        {showButton && (
          <ActionButton
            Icon={PlusSmallIcon}
            label="Start streaming"
            href={galleryPath}
            className="primary-action-button flex items-center py-2"
          />
        )}
        <a
          className="font-light text-neutral-400 hover:underline text-sm"
          href="https://docs.coindrip.finance/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
      <img
        src="/card-hour-glass.svg"
        className={classNames("right-0 sm:right-10 -bottom-4 sm:bottom-0 absolute", showButton ? "h-40" : "h-36")}
      />
    </div>
  );
}
