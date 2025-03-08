import { IStreamResource } from '../../types';
import StreamTableItem from './StreamTableItem';

export default function StreamsTable({ streams }: { streams: IStreamResource[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="sm:table-fixed streams-table">
        <thead>
          <tr className="text-left uppercase">
            <th>status</th>
            <th>from/to</th>
            <th>value</th>
            <th>timeline</th>
            <th>progress</th>
          </tr>
        </thead>
        <tbody>
          {streams.map((stream) => (
            <StreamTableItem stream={stream} key={stream.stream_id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
