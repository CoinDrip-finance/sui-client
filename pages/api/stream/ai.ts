import { handler } from '../../../actions/_base/handler';
import GetStreamsPaginatedAction from '../../../actions/GetStreamsPaginatedAction';
import PostAiCreateAction from '../../../actions/PostAiCreate';

export default handler({
  post: PostAiCreateAction,
});
