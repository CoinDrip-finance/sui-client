import { NextApiRequest } from 'next';

import { StreamsRepository } from '../repositories/StreamsRepository';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class GetStreamsPaginatedAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<any[]>> {
    // @ts-ignore
    const {
      address,
      nfts: _nfts,
      page,
      page_size,
    }: { address: string; nfts: string; page: string; page_size: string } = req.query;

    if (!(address || _nfts)) {
      return new ApiResponse({
        body: [],
      }).cache(60, 6);
    }

    const nfts = _nfts ? _nfts.split(",") : [];

    const streamsRepository = new StreamsRepository();
    const { data } = await streamsRepository.paginate({
      address,
      nfts,
      page: parseInt(page),
      size: parseInt(page_size),
    });

    return new ApiResponse({
      body: data,
    }).cache(60, 6);
  }
}
