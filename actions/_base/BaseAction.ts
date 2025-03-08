import Joi from 'joi';
import { NextApiRequest } from 'next';

import ApiResponse from './ApiResponse';

export default abstract class BaseAction {
  public abstract handle(req: NextApiRequest): ApiResponse<unknown> | Promise<ApiResponse<unknown>>;

  public rules(): Joi.Schema | null | Promise<Joi.Schema | null> {
    return null;
  }
}
