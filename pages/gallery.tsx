import { AcademicCapIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { NextSeo } from 'next-seo';

import StreamTypeItem, { StreamItemType } from '../components/gallery/StreamTypeItem';
import BackButtonWrapper from '../components/shared/BackWrapper';
import Layout from '../components/shared/Layout';
import { StreamType } from '../types';
import { homePath, newStreamPath } from '../utils/routes';
import { classNames } from '../utils/presentation';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export const streamTypes: StreamItemType[] = [
  { id: StreamType.Linear, title: "Linear", description: "Send assets at a constant rate/second" },
  {
    id: StreamType.CliffLinear,
    title: "Linear with cliff",
    description: "Just like Linear stream but with a cliff period",
  },
  {
    id: StreamType.Steps,
    title: "Unlock in steps",
    description: "Traditional vesting contract with periodical unlocks.",
    locked: false,
  },
  {
    id: StreamType.Exponential,
    title: "Exponential",
    description: "Just like Linear stream but with a cliff period",
    locked: true,
  },
  {
    id: StreamType.CliffExponential,
    title: "Exponential with cliff",
    description: "Just like Linear stream but with a cliff period",
    locked: true,
  },
];

export default function GallerPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const router = useRouter();

  const streamWithAi = () => {
    const input = inputRef.current?.value;
    (async () => {
      try {
        setAiError(false);
        setLoading(true);
        const { data } = await axios.post('/api/stream/ai', { input });
        // console.log(data)
        router.push({
          pathname: newStreamPath,
          query: {
            ...data,
            ai: true
          },
        });
      } catch (e) {
        setAiError(true);
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <Layout>
      <NextSeo title="Streams Gallery" />
      <BackButtonWrapper title="Pick a template" href={homePath}>

        <p className="mt-6 sm:mt-12 font-light text-sm mb-4">Quickly stream using AI</p>
        <div className='relative flex flex-col w-full rounded-lg border border-neutral-800 bg-neutral-900 p-4'>
          <input
            ref={inputRef}
            type="text"
            className={classNames(
              "border-neutral-900 bg-neutral-900 rounded-lg focus:border-neutral-900 h-8 text-sm focus:outline-none w-full p-0 mb-4"
            )}
            placeholder='Stream 5 SUI to alice for 3600 seconds'
            readOnly={loading}
          />
          <div className='flex items-center justify-between'>
            <a href="#" className="flex items-center text-xs font-light justify-center text-neutral-400">
              <AcademicCapIcon className="h-4 w-4 mr-2" /> See more prompts
            </a>
            <button
              className="primary-action-button !py-2"
              onClick={streamWithAi}
              disabled={loading}
            >
              {loading ? 'Loading...' : <span className='flex items-center'>Go <ArrowUpIcon className='h-4 ml-2' /></span>}
            </button>
          </div>
        </div>
        {aiError && <p className='mt-2 text-red-500 text-xs'>Please provide more details on the stream you&apos;re trying to create.</p>}
        {/* TODO: Add a link to the docs */}

        <p className="mt-8 font-light text-sm">Select a Stream shape</p>
        <div className="mt-4 flex flex-col space-y-8">
          {streamTypes.map((type) => (
            <StreamTypeItem key={type.id} item={type} />
          ))}

          {/* TODO: Add a link to the docs */}
          <a href="#" className="underline flex items-center text-sm font-light justify-center">
            <AcademicCapIcon className="h-4 w-4 mr-2" /> Learn more about token streams
          </a>
        </div>
      </BackButtonWrapper>
    </Layout>
  );
}