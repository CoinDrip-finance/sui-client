import { createClient } from '@supabase/supabase-js';

import { chainId } from '../config';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC as string
);

const DEVNET_PREFIX = "";
export const STREAMS_TABLE = "StreamCreated";
export const CLAIMS_TABLE = "StreamClaimed";
export const DESTROYED_TABLE = "StreamDestroyed";
export const STREAM_LISTING_VIEW = "latest_stream_claimed_per_created";

export const getTableName = (key: string) => {
  if (chainId === "D") return DEVNET_PREFIX + key;
  return key;
};
