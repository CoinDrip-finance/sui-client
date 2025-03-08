import { Query } from '@multiversx/sdk-core/out';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';

import { network } from '../config';

export const querySc = async (query: Query) => {
  const networkProvider = new ApiNetworkProvider(network.apiAddress!);

  return networkProvider.queryContract(query);
};
