import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { denominate } from '../../utils/economics';
import { formatNumber } from '../../utils/presentation';
import { TokenWithMetadata } from './TokenSelect';

export default function AmountInput({ token }: { token?: TokenWithMetadata }) {
  const { setValue, register } = useFormContext();
  const [maxBalance, setMaxBalance] = useState<BigNumber>(new BigNumber(0));

  useEffect(() => {
    setMaxBalance(new BigNumber(token?.totalBalance || 0));
  }, [token]);

  useEffect(() => {
    setValue("amount", null);
  }, [token?.coinType]);

  const maxBalanceLabel = useMemo(() => {
    const number = denominate(maxBalance.toString(), 2, token?.decimals).toNumber();
    return formatNumber(number);
  }, [maxBalance]);

  const selectMax = (e: any) => {
    e.preventDefault();
    const number = denominate(maxBalance.toString(), token?.decimals, token?.decimals).toNumber();
    setValue("amount", number);
  };

  return (
    <div>
      <div className="block font-light text-sm mb-2">Amount</div>
      <div className="relative w-full">
        <input
          type="number"
          className="bg-neutral-950 rounded-lg border border-neutral-900 focus:border-neutral-900 h-12 font-medium text-sm focus:outline-none px-4 w-full"
          step="0.0001"
          {...register("amount")}
        />

        <button
          className="h-8 absolute right-2 rounded-lg text-sm px-2 mt-2 bg-neutral-800 font-light text-neutral-400"
          onClick={selectMax}
        >
          Max: {maxBalanceLabel}
        </button>
      </div>
    </div>
  );
}
