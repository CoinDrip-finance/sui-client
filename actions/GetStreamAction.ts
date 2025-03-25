import { NextApiRequest } from 'next';

import { ClaimsRepository } from '../repositories/ClaimsRepository';
import { StreamsRepository } from '../repositories/StreamsRepository';
import { IStreamResource } from '../types';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class GetStreamAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<IStreamResource>> {
    const id: string = req.query.id as string;

    const streamsRepository = new StreamsRepository();
    const { data: streamFromDb } = await streamsRepository.findById(id);


    const claimsRepository = new ClaimsRepository();
    const { data: claims } = await claimsRepository.getClaimsByStream(streamFromDb?.id as number);

    return new ApiResponse({
      body: {
        ...streamFromDb,
        start_time: parseInt(streamFromDb.start_time),
        end_time: parseInt(streamFromDb.end_time),
        claims,
      },
    }).cache(60, 6);
  }
}
