import { Router } from 'express';
import { pushRecord, pullChanges } from '../controllers/records..controller.js';

const router = Router();

router.post('/sync', pushRecord);
router.get('/sync/since/:since', pullChanges);

export default router;