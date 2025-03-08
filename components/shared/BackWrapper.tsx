import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import { classNames } from '../../utils/presentation';

interface BackButtonWrapperProps {
  title?: string;
  href: string;
  children: any;
  size?: string;
}

export default function BackButtonWrapper({ title, href, children, size = "max-w-screen-xs" }: BackButtonWrapperProps) {
  return (
    <div className={classNames("w-full mx-auto relative", size)}>
      <div className="flex items-center">
        <Link href={href}>
          <button className="p-1 rounded-full bg-neutral-900 sm:absolute sm:-left-16 sm:-top-1">
            <ChevronLeftIcon className="text-white w-6 h-6" />
          </button>
        </Link>

        {title && <h1 className="font-medium text-xl ml-3 sm:ml-0">{title}</h1>}
      </div>

      {children}
    </div>
  );
}
