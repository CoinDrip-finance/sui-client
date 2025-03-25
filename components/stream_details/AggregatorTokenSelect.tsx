import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import { classNames } from '../../utils/presentation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import axios from 'axios';

export interface AggregatorToken {
  type: string;
  decimals: number;
  symbol: string;
  name: string;
  iconUrl: string;
  verified?: boolean;
}

export default function AggregatorTokenSelect({
  defaultToken,
  onSelect,
}: {
  defaultToken: string;
  onSelect: (token: AggregatorToken | null) => void;
}) {
  const account = useCurrentAccount();
  const address = account?.address;
  const [query, setQuery] = useState("");
  const [selectedPerson, _setSelectedPerson] = useState<AggregatorToken>();
  const [tokens, setTokens] = useState<AggregatorToken[]>([]);
  const [verifiedTokens, setVerifiedTokens] = useState<AggregatorToken[]>([]);
  const [canUseAggregator, setCanUseAggregator] = useState(true);

  useEffect(() => {
    _setSelectedPerson(tokens?.find(e => e.type === `0x${defaultToken}`));
  }, [defaultToken, tokens]);

  useEffect(() => {
    (async () => {
      const { data }: { data: AggregatorToken[] } = await axios.get('/api/tokens');
      if (!data.filter(e => e.type).length) {
        setCanUseAggregator(false);
      } else {
        setTokens(data);
        setVerifiedTokens(data.filter(e => e?.verified));
      }
    })();
  }, []);

  const filteredPeople = useMemo(() => {
    return query.length < 3
      ? verifiedTokens
      : tokens.filter((token) => {
        return token.name.toLowerCase().includes(query.toLowerCase());
      }).sort((a, b) => {
        if (a.verified === b.verified) return 0;
        return a.verified ? -1 : 1;
      }).slice(0, 500);
  }, [query, tokens, verifiedTokens]);

  const setSelectedPerson = (token: AggregatorToken) => {
    _setSelectedPerson(token);

    if (token.type !== defaultToken) {
      onSelect(token);
    } else {
      onSelect(null);
    }
  };

  if (!canUseAggregator) return null;

  return (
    <div className="mt-6">
      <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
        <Combobox.Label className="block font-light text-sm mb-2">Withdraw in</Combobox.Label>
        <div className="relative mt-1">
          <Combobox.Button className="w-full">
            <Combobox.Input
              className="block w-full cursor-pointer rounded-lg bg-neutral-800 px-12 h-12 text-white font-medium text-sm border border-neutral-700 border:border-neutral-800 focus:border-neutral-800 focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(token: AggregatorToken) => token.name}
              autoComplete="false"
              readOnly={false}
            />
            <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </Combobox.Button>

          {selectedPerson && (
            <div className="absolute inset-y-0 left-4 flex items-center">
              <img src={selectedPerson.iconUrl} alt="" className="h-6 w-6 rounded-full" />
            </div>
          )}

          {filteredPeople.length > 0 && (
            <Combobox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-neutral-800 py-1 text-sm shadow-lg ring-1 ring-neutral-700 focus:outline-none font-medium">
              {filteredPeople.map((token) => (
                <Combobox.Option
                  key={token.type}
                  value={token}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-pointer select-none py-2 pl-4 pr-9",
                      active ? "text-white" : "text-neutral-400"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        <img src={token.iconUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-full mr-3" />
                        <span className={classNames("truncate", selected ? "text-white" : "")}>{token.name}</span>
                      </div>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-white"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      <p className="text-xs mt-2 text-neutral-600">
        Using the 7k Aggregator you can withdraw from this stream in any token.
      </p>
    </div>
  );
}
