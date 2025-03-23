import { handler } from '../../actions/_base/handler';
import GetEsdtAction from '../../actions/GetEsdtsAction';

export default handler({
    get: GetEsdtAction,
});
