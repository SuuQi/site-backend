import { Router } from 'site-middle-layer';
import Publish from './api/Publish';

const router = new Router();

router.use('/api/publish', Publish.routes(), Publish.allowedMethods());

export default router;
