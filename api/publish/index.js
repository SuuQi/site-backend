import { Router } from 'site-middle-layer';
import { list } from './publish.controller';

const router = new Router();

router.get('/', list);

export default router;
