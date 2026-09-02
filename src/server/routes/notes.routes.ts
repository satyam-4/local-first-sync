import { Router } from 'express';
import { pushNote, pullChanges } from '../controllers/notes.controller.js';

const router = Router();

router.post('/notes', pushNote);
router.get('/notes/since/:since', pullChanges);

export default router;