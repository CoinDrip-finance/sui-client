import { useAuth } from '@elrond-giants/erd-react-hooks/dist';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

import { StreamType } from '../../types';
import { authPath, newStreamPath } from '../../utils/routes';
import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useMemo, useState } from 'react';

export interface StreamItemType {
  id: StreamType;
  title: string;
  description: string;
  locked?: boolean;
}

export default function StreamTypeItem({ item }: { item: StreamItemType }) {
  const account = useCurrentAccount();
  const [open, setOpen] = useState(false);


  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  }

  const authenticated = useMemo(() => {
    return !!account;
  }, [account])

  return (
    <div className="flex bg-neutral-950 border border-neutral-900 rounded-lg p-5 justify-between items-center">
      <div className="flex flex-col">
        <div className="font-medium text-lg mb-1">{item.title}</div>
        <div className="font-light text-sm mb-6">{item.description}</div>
        {item.locked ? (
          <button className="flex auth-button py-1 font-sm w-fit justify-center items-center text-white bg-neutral-700 cursor-not-allowed">
            <LockClosedIcon className="h-4 w-4 mr-2" />
            Coming soon
          </button>
        ) : authenticated ? (
          <Link href={newStreamPath(item.id)}>
            <button className="auth-button py-1 font-sm w-40">Pick this</button>
          </Link>
        ) : (
          <ConnectModal
            trigger={
              <>
                <button className="hidden sm:flex auth-button py-1 font-sm px-4 items-center w-fit" onClick={() => setOpen(true)}>
                  <LockClosedIcon className="h-4 w-4 mr-2" />
                  Connect to stream
                </button>
                <button className="sm:hidden auth-button py-1 font-sm px-4 flex items-center w-fit" onClick={() => setOpen(true)}>
                  <LockClosedIcon className="h-4 w-4 mr-2" />
                  Connect
                </button>
              </>
            }
            open={open}
            onOpenChange={onOpenChange}
          />
        )}
      </div>
      <div>
        <img src={`/gallery/${item.id}.svg`} alt={item.title} className="h-20" />
      </div>
    </div>
  );
}
