import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { NextSeo } from 'next-seo';

import StreamTypeItem, { StreamItemType } from '../components/gallery/StreamTypeItem';
import BackButtonWrapper from '../components/shared/BackWrapper';
import Layout from '../components/shared/Layout';
import { StreamType } from '../types';
import { homePath, newStreamPath } from '../utils/routes';
import { classNames } from '../utils/presentation';
import isMobile from 'is-mobile';
import { useRef, useState } from 'react';
import { E } from '@tanstack/query-core/build/legacy/hydration-B_mC2U5v';
import axios from 'axios';
import { set } from 'zod';
import { useRouter } from 'next/router';
import ai from './api/stream/ai';

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

        <p className="mt-6 sm:mt-12 font-light text-sm mb-2">Quickly stream using AI</p>
        <div className='relative w-full'>
          <input
            ref={inputRef}
            type="text"
            className={classNames(
              "bg-neutral-950 rounded-lg border border-neutral-900 focus:border-neutral-900 h-12 font-medium text-sm focus:outline-none pl-4 w-full",
              isMobile() ? "pr-12" : "pr-4"
            )}
            placeholder='Stream 5 SUI to alice for 3600 seconds'
            readOnly={loading}
          />
          <button
            className="h-8 absolute right-2 rounded-lg text-sm px-2 mt-2 bg-neutral-800 font-light text-neutral-400 disabled:cursor-not-allowed disabled:bg-neutral-700"
            onClick={streamWithAi}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Go!'}
          </button>
        </div>
        {aiError && <p className='mt-2 text-red-500 text-xs'>Please provide more details on the stream you&apos;re trying to create.</p>}
        {/* TODO: Add a link to the docs */}
        <a href="#" className="underline flex items-center text-sm font-light justify-center mt-2">
          <AcademicCapIcon className="h-4 w-4 mr-2" /> See more prompt examples
        </a>

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
