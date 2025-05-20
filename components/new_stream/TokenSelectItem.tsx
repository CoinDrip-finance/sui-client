import { Combobox } from "@headlessui/react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { CoinBalance } from "@mysten/sui/dist/cjs/client";
import { classNames, extractTokenName } from "../../utils/presentation";
import { CheckIcon } from "@heroicons/react/24/outline";
import { denominate } from "../../utils/economics";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function normalizeAddress(addr: string) {
    return addr.replace(/^0x0+/, '0x').toLowerCase();
}

function findToken(arr: any[], target: string) {
    const normalizedTarget = normalizeAddress(target);
    return arr.find(item => normalizeAddress(item.type) === normalizedTarget);
}

export const TokenSelectItem = ({ token }: { token: CoinBalance }) => {
    const [_iconUrl, setIconUrl] = useState<string | undefined>();

    const { data: coinMetadata } = useSuiClientQuery(
        'getCoinMetadata',
        {
            coinType: token.coinType
        },
    );

    useEffect(() => {
        if (coinMetadata && token && !coinMetadata.iconUrl) {
            (async () => {
                const { data } = await axios.get('/api/tokens');
                const tokenInfo = findToken(data, token.coinType);
                setIconUrl(tokenInfo?.iconUrl);
            })();
        }
    }, [coinMetadata, token]);

    const iconUrl = useMemo(() => {
        return coinMetadata?.iconUrl || _iconUrl;
    }, [_iconUrl, coinMetadata]);

    return <Combobox.Option
        key={token.coinType}
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
                    <img src={iconUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                    <span className={classNames("ml-3 truncate", selected ? "text-white" : "")}>
                        {extractTokenName(token.coinType)}{" "}
                        <span className={classNames(active || selected ? "text-neutral-100" : "text-neutral-500")}>
                            ({denominate(token.totalBalance, 2, coinMetadata?.decimals || 9).toLocaleString()})
                        </span>
                    </span>
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
}