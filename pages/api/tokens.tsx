import { handler } from '../../actions/_base/handler';
import GetAllTokensAction from '../../actions/GetAllTokensAction';

export default handler({
    get: GetAllTokensAction,
});
