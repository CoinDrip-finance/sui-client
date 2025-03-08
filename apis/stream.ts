import axios from 'axios';

export const getStreamData = async (streamId: string) => {
  const { data } = await axios.get(`/api/stream/${streamId}`);

  return data;
};
