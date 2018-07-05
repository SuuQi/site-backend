import { Router } from 'site-middle-layer';
import Publish from './api/publish';
import Ftp from './api/ftp';

const router = new Router();

router.use('/api/publish', Publish.routes(), Publish.allowedMethods());
router.use('/api/ftp', Ftp.routes(), Ftp.allowedMethods());

router.post('/api/git', async function (ctx) {
    ctx.body = ctx.request;
    console.log(ctx.request.fields);
})

export default router;
