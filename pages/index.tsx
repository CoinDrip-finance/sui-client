import type { NextPage } from "next";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { NextSeo } from "next-seo";
import { useRef, useState } from "react";
import Dropdown, { DropdownItem } from "../components/Dropdown";
import InfoCard from "../components/InfoCard";
import ActionButton from "../components/shared/ActionButton";
import Layout from "../components/shared/Layout";
import { galleryPath } from "../utils/routes";
import OutgoingStreams from "../components/stream_list/OutgoingStreams";
import IncomingStreams from "../components/stream_list/IncomingStreams";
import { useChat } from "@ai-sdk/react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const streamFilterOptions: DropdownItem[] = [
  // { id: "all", label: "All Streams" },
  { id: "incoming", label: "Incoming" },
  { id: "outgoing", label: "Outgoing" },
];

const Home: NextPage = () => {
  const [selectedFilter, setSelectedFilter] = useState(streamFilterOptions[0]);
  const childRef = useRef();
  const account = useCurrentAccount();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      wallet: account?.address
    }
  });

  const claimAll = () => {
    if (childRef.current) {
      // @ts-ignore
      childRef.current.triggerChildFunction();
    }
  }

  return (
    <Layout>
      <NextSeo title="Dashboard" />
      <div className="max-w-screen-lg w-full mx-auto sm:mt-20 mb-7 flex items-center justify-between">
        <div>
          <h1 className="font-medium text-2xl mb-1 sm:mb-3">Dashboard</h1>
          <Dropdown
            items={streamFilterOptions}
            selectedItem={selectedFilter}
            onChange={(newItem) => setSelectedFilter(newItem)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <ActionButton
            Icon={PlusSmallIcon}
            label="Claim all"
            onClick={claimAll}
            className="primary-action-button flex items-center"
          />
          <ActionButton
            Icon={PlusSmallIcon}
            label="Create Stream"
            href={galleryPath}
            className="primary-action-button flex items-center"
          />
        </div>
      </div>

      {selectedFilter.id === "outgoing" ? <OutgoingStreams /> : <IncomingStreams ref={childRef} />}

      <div className="max-w-screen-lg mx-auto mt-16">
        <InfoCard showButton={true} />
      </div>
    </Layout>
  );
};

export default Home;
