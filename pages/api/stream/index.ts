import { handler } from '../../../actions/_base/handler';
import GetStreamsPaginatedAction from '../../../actions/GetStreamsPaginatedAction';

export default handler({
  get: GetStreamsPaginatedAction,
});
