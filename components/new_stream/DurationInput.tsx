import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import DurationModal from './DurationModal';
import { CreateStreamAiInput } from '../../pages/new';

interface DurationInputProps {
  fieldIndex: number;
  label: string;
  formId: string;
  aiInput?: CreateStreamAiInput;
}

const formatDuration = (ms: number) => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? "s" : ""}`)
    .join(", ");
};

export default function DurationInput({ fieldIndex, label, formId, aiInput }: DurationInputProps) {
  const { setValue, register } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>();

  useEffect(() => {
    // @ts-ignore
    const duration = aiInput?.[formId];
    if (duration) {
      onModalClose(parseInt(duration));
    }
  }, [aiInput]);

  const onModalClose = (duration?: number) => {
    setIsModalOpen(false);
    if (duration) {
      setValue(`streams.${fieldIndex}.${formId}`, duration);
      setSelectedDuration(duration);
    } else {
      setSelectedDuration(null);
    }
  };

  const formattedDuration = useMemo(() => {
    if (!selectedDuration) return "";

    return formatDuration(selectedDuration * 1000);
  }, [selectedDuration]);

  return (
    <div className='flex-1'>
      <div className="block font-light text-sm mb-2">{label}</div>
      <div className="relative w-full">
        <input
          type="text"
          className="bg-neutral-950 rounded-lg border border-neutral-900 focus:border-neutral-900 h-12 font-medium text-sm focus:outline-none pl-4 w-full cursor-pointer"
          readOnly={true}
          onClick={() => setIsModalOpen(true)}
          value={formattedDuration}
        />
      </div>

      <DurationModal open={isModalOpen} onClose={onModalClose} />
    </div>
  );
}
