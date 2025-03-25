import { StreamType } from '../types';

export const homePath = "/";
export const streamDetailsPath = (id: string) => `/stream/${id}`;
export const galleryPath = "/gallery";
export const newStreamPath = '/new';
export const newStreamPathType = (type: StreamType) => `/new?stream_type=${type}`;
