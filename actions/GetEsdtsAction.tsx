import axios from 'axios';
import { NextApiRequest } from 'next';

import { network } from './../config';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class GetEsdtAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<any>> {
    const { data } = await axios.get(process.env.NEXT_PUBLIC_ALL_TOKENS_API!);

    return new ApiResponse({
      body: data
    });
  }
}
