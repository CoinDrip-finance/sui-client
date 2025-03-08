import { useEffect, useMemo, useState } from 'react';

import StreamDetailsBasePopup from './PopupBase';
import { StreamActionType } from './StreamActions';

export interface MoreActionsItem {
  type: StreamActionType;
  title: string;
  description: string;
  buttonLabel: string;
  Icon: any;
  disabled: boolean;
}

interface MoreActionsPopupProps {
  open: boolean;
  onClose: (action?: StreamActionType) => void;
  items: MoreActionsItem[];
}

export default function MoreActionsPopup({ open, items, onClose }: MoreActionsPopupProps) {
  const onCloseWrapper = () => {
    onClose();
  };

  return (
    <StreamDetailsBasePopup open={open} onClose={onCloseWrapper} title="More actions">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
          {items.map((item) => (
            <div key={item.title}>
              <div className="text-lg">{item.title}</div>
              <p className="text-sm text-neutral-400 mt-1">{item.description}</p>

              <button
                onClick={() => onClose(item.type)}
                className="bg-neutral-800 px-6 py-2 text-sm font-medium rounded-lg hover:bg-opacity-75 mt-6 flex items-center disabled:cursor-not-allowed disabled:text-neutral-500"
                disabled={item.disabled}
              >
                <div className="w-4 h-4 mr-2">
                  <item.Icon />
                </div>
                {item.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </StreamDetailsBasePopup>
  );
}
