import Router from 'site-middle-layer';
import { list, detail, save, update, remove, test } from './ftp.controller';

const router = new Router();

router.get('/', list);
router.get('/:id', detail);
router.post('/', save);
router.pub('/connect/test', test);
router.pub('/:id', update);
router.delete('/:id', remove);

export default router;
