import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Moment from 'react-moment';
import { copyToClipboard, getShortAddress } from '../../utils/presentation';

interface StreamPropItemProps {
  label: string;
  value?: string;
  Icon: any;
  date?: string;
  copy?: string;
}

export default function StreamPropItem({ label, value, Icon, date, copy }: StreamPropItemProps) {
  const handleCopy = async () => {
    if (!copy) return;
    await copyToClipboard(copy);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0 h-12 w-12 bg-neutral-800 border border-primary/10 p-2 rounded-lg text-primary">
        <Icon />
      </div>

      <div className="flex-auto">
        <div className="text-neutral-500 text-sm font-light">{label}</div>
        <div className='flex items-center'>
          {value && <div className="text-sm">{value}</div>}
          {copy && <div className="text-sm">{getShortAddress(copy, 4)}</div>}
          {date && <Moment fromNow>{date}</Moment>}
          {copy && <button onClick={handleCopy}><DocumentDuplicateIcon className='h-4 opacity-70 ml-2' /></button>}
        </div>
      </div>
    </div>
  );
}
