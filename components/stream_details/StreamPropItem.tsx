import Moment from 'react-moment';

interface StreamPropItemProps {
  label: string;
  value?: string;
  Icon: any;
  date?: string;
}

export default function StreamPropItem({ label, value, Icon, date }: StreamPropItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0 h-12 w-12 bg-neutral-800 border border-neutral-700 p-2 rounded-lg text-neutral-500">
        <Icon />
      </div>

      <div className="flex-auto">
        <div className="text-neutral-500 text-sm font-light">{label}</div>
        {value && <div className="text-sm">{value}</div>}
        {date && <Moment fromNow>{date}</Moment>}
      </div>
    </div>
  );
}
