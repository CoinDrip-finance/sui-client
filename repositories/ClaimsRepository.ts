import { IClaimResource } from '../types';
import { CLAIMS_TABLE, getTableName, supabase } from '../utils/supabase';
import { BaseRepository } from './BaseRepository';

export class ClaimsRepository extends BaseRepository<IClaimResource> {
  constructor() {
    const table = supabase.from(getTableName(CLAIMS_TABLE));
    super(table, "stream_id");
  }

  async getClaimsByStream(streamId: number) {
    const { data, count } = await this._table
      .select("*", { count: "exact" })
      .eq(this._idField, streamId)
      .order("created_at", { ascending: false });

    return { data, count };
  }
}
