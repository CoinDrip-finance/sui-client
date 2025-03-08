import axios from 'axios';

import { network, streamsNftCollection } from '../config';

export const fetchStreamNftsNonceList = async (address: string) => {
  const { data } = await axios.get(
    `${network.apiAddress}/accounts/${address}/nfts?collections=${streamsNftCollection}&fields=nonce`
  );

  return data.map((e: any) => e.nonce);
};

export const nonceToHex = (nonce: number) => {
  const h = (+nonce).toString(16);
  return h.length === 1 ? "0" + h : h;
};
