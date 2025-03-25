import { PostgrestSingleResponse } from '@supabase/supabase-js';

import { IStreamResource } from '../types';
import { CLAIMS_TABLE, getTableName, STREAM_LISTING_VIEW, STREAMS_TABLE, supabase } from '../utils/supabase';
import { BaseRepository } from './BaseRepository';

export class StreamsRepository extends BaseRepository<IStreamResource> {
  constructor() {
    const table = supabase.from(getTableName(STREAM_LISTING_VIEW));
    super(table, "stream_id");
  }

  async paginate({ page, size, address, nfts }: { page?: number; size?: number; address?: string; nfts?: string[] }) {
    const { from, to } = StreamsRepository.computePageRange({ page, size });

    const filters: string[] = [];
    if (address) {
      filters.push(`sender.eq.${address}`);
    }
    if (nfts?.length) {
      const idsString = nfts.join(",");
      filters.push(`stream_id.in.(${idsString})`);
    }

    let query = this._table
      .select(`*`, { count: "exact" })
      .or(filters.join(","))
      // .eq("status", "active")
      .order("createdAt", { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const result = data.map((e: IStreamResource) => {
      return {
        ...e,
        // @ts-ignore
        start_time: parseInt(e.start_time),
        // @ts-ignore
        end_time: parseInt(e.end_time),
      }
    });

    return { data: result, count };
  }

  findById(id: string): PromiseLike<PostgrestSingleResponse<any>> {
    if (!this._idField) throw new Error("Unique ID not provided.");

    return this._table
      .select(`*`)
      .eq(this._idField, id)
      .single();
  }
}
