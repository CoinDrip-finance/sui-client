import axios from 'axios';
import { NextApiRequest } from 'next';

import { network } from './../config';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';

export default class GetEsdtAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<any>> {
    const { address } = req.query;

    const { data } = await axios.get(`${network.apiAddress}/accounts/${address}/tokens?from=0&size=10000`);

    return new ApiResponse({
      body: data.map((token: any) => {
        return {
          identifier: token.identifier,
          icon: token?.assets?.pngUrl,
          decimals: token.decimals,
          balance: token.balance,
        };
      }),
    });
  }
}
