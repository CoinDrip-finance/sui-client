import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { NextSeo } from 'next-seo';

import StreamTypeItem, { StreamItemType } from '../components/gallery/StreamTypeItem';
import BackButtonWrapper from '../components/shared/BackWrapper';
import Layout from '../components/shared/Layout';
import { StreamType } from '../types';
import { homePath } from '../utils/routes';

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
  return (
    <Layout>
      <NextSeo title="Streams Gallery" />
      <BackButtonWrapper title="Pick a template" href={homePath}>
        <p className="mt-6 sm:mt-16 font-light text-sm">Select a Stream shape</p>

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
