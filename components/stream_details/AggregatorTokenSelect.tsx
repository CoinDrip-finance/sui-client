import { Aggregator } from '@ashswap/ash-sdk-js/out';
import { useAuth } from '@elrond-giants/erd-react-hooks/dist';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';

import { chainId, mediaUrl } from '../../config';
import { classNames } from '../../utils/presentation';

const getTokenMediaUrl = (token: string) => {
  if (token === "EGLD") {
    return "/new_stream/egld_icon.png";
  }

  return `${mediaUrl}/tokens/asset/${token}/logo.png`;
};

export default function AggregatorTokenSelect({
  defaultToken,
  onSelect,
}: {
  defaultToken: string;
  onSelect: (token: string | null) => void;
}) {
  const { address } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedPerson, _setSelectedPerson] = useState<string>();
  const [tokens, setTokens] = useState<string[]>([]);
  const [canUseAggregator, setCanUseAggregator] = useState(true);

  useEffect(() => {
    _setSelectedPerson(defaultToken);
  }, [defaultToken]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const agService = new Aggregator({ chainId });
      const ashTokens = await agService.getTokens();

      const tokens = ashTokens.map((e) => e.id);

      if (!tokens.includes(defaultToken)) {
        if (defaultToken === "EGLD") {
          tokens.unshift(defaultToken);
        } else {
          setCanUseAggregator(false);
        }
      }
      setTokens(tokens);
    })();
  }, []);

  const filteredPeople = useMemo(() => {
    return query === ""
      ? tokens
      : tokens.filter((token) => {
          return token.toLowerCase().includes(query.toLowerCase());
        });
  }, [query, tokens]);

  const setSelectedPerson = (token: string) => {
    _setSelectedPerson(token);

    if (token !== defaultToken) {
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
              displayValue={(token: string) => token}
              autoComplete="false"
              readOnly={true}
            />
            <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </Combobox.Button>

          {selectedPerson && (
            <div className="absolute inset-y-0 left-4 flex items-center">
              <img src={getTokenMediaUrl(selectedPerson)} alt="" className="h-6 w-6 rounded-full" />
            </div>
          )}

          {filteredPeople.length > 0 && (
            <Combobox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-neutral-800 py-1 text-sm shadow-lg ring-1 ring-neutral-700 focus:outline-none font-medium">
              {filteredPeople.map((token) => (
                <Combobox.Option
                  key={token}
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
                        <img src={getTokenMediaUrl(token)} alt="" className="h-6 w-6 flex-shrink-0 rounded-full mr-3" />
                        <span className={classNames("truncate", selected ? "text-white" : "")}>{token}</span>
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
        Using the AshSwap Aggregator you can withdraw from this stream in any token.
      </p>
    </div>
  );
}
