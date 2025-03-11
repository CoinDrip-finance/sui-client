import axios from 'axios';
import BigNumber from 'bignumber.js';
import { NextApiRequest } from 'next';

import { nonceToHex } from '../apis/nfts';
import { ClaimsRepository } from '../repositories/ClaimsRepository';
import { StreamsRepository } from '../repositories/StreamsRepository';
import { IStreamResource, IStreamResponse } from '../types';
import StreamingContract from '../utils/contracts/streamContract';
import { network, streamsNftCollection } from './../config';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

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
        claims,
      },
    }).cache(60, 6);
  }
}
