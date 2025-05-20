import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { classNames, extractTokenName } from '../../utils/presentation';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { CoinBalance, CoinMetadata } from '@mysten/sui/dist/cjs/client';
import { TokenSelectItem } from './TokenSelectItem';
import { CreateStreamAiInput } from '../../pages/new';
import axios from 'axios';

function normalizeAddress(addr: string) {
  return addr.replace(/^0x0+/, '0x').toLowerCase();
}

function findToken(arr: any[], target: string) {
  const normalizedTarget = normalizeAddress(target);
  return arr.find(item => normalizeAddress(item.type) === normalizedTarget);
}

export type TokenWithMetadata = CoinBalance & CoinMetadata;

export default function TokenSelect({ onSelect, aiInput }: { onSelect: (token: TokenWithMetadata) => void; aiInput?: CreateStreamAiInput }) {
  const [_iconUrl, setIconUrl] = useState<string | undefined>();
  const account = useCurrentAccount();
  const [query, setQuery] = useState("");
  const [selectedPerson, _setSelectedPerson] = useState<CoinBalance>();
  const { setValue } = useFormContext();

  const { data: tokens } = useSuiClientQuery(
    'getAllBalances',
    {
      owner: account?.address!
    },
  );

  const { data: selectedCoinMetadata } = useSuiClientQuery(
    'getCoinMetadata',
    {
      coinType: selectedPerson?.coinType!
    },
  );


  useEffect(() => {
    if (selectedCoinMetadata && selectedPerson && !selectedCoinMetadata.iconUrl) {
      (async () => {
        const { data } = await axios.get('/api/tokens');
        const tokenInfo = findToken(data, selectedPerson.coinType);
        setIconUrl(tokenInfo?.iconUrl);
      })();
    }
  }, [selectedCoinMetadata, selectedPerson]);

  const iconUrl = useMemo(() => {
    return selectedCoinMetadata?.iconUrl || _iconUrl;
  }, [_iconUrl, selectedCoinMetadata]);

  useEffect(() => {
    if (aiInput?.token && tokens) {
      const token = tokens?.find((token) => token.coinType === aiInput.token.replace(/0x0+/, "0x"));
      if (token) {
        setSelectedPerson(token);
      }
    }
  }, [aiInput, tokens]);

  const filteredPeople = useMemo(() => {
    if (!tokens) return [];
    return query === ""
      ? tokens
      : tokens.filter((token) => {
        return token.coinType.toLowerCase().includes(query.toLowerCase());
      });
  }, [query, tokens]);

  useEffect(() => {
    if (selectedPerson && selectedCoinMetadata) {
      onSelect({
        ...selectedPerson,
        ...selectedCoinMetadata
      });
    }
  }, [selectedPerson, selectedCoinMetadata]);

  const setSelectedPerson = (token: CoinBalance) => {
    setValue("payment_token", token.coinType);
    _setSelectedPerson(token);
  };

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Label className="block font-light text-sm mb-2">Token</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Button className="w-full">
          <Combobox.Input
            className="block w-full cursor-pointer rounded-lg bg-neutral-950 px-12 h-12 text-white font-medium text-sm border border-neutral-900 border:border-neutral-800 focus:border-neutral-800 focus:outline-none"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(token: CoinBalance) => extractTokenName(token.coinType)}
            autoComplete="false"
            readOnly={true}
          />
          <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </Combobox.Button>

        {selectedPerson && (
          <div className="absolute inset-y-0 left-4 flex items-center">
            <img src={iconUrl!} alt={selectedPerson.coinType} className="h-6 w-6 rounded-full" />
          </div>
        )}

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-neutral-800 py-1 text-sm shadow-lg ring-1 ring-neutral-700 focus:outline-none font-medium">
            {filteredPeople.map((token) => <TokenSelectItem key={token.coinType} token={token} />)}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

