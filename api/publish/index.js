import { Router } from 'site-middle-layer';
import { list, save } from './publish.controller';

const router = new Router();

router.get('/', list);
router.post('/', save);

export default router;
