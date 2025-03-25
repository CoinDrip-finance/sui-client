import BigNumber from 'bignumber.js';
import { denomination as defaultDenomination } from '../config';

export const denominate = (
  value: number | string,
  decimalPlaces = 2,
  denomination = defaultDenomination
): BigNumber => {
  const bigValue = new BigNumber(value);

  return bigValue.shiftedBy(-(denomination ?? 9)).decimalPlaces(decimalPlaces);
};
