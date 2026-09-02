import type { Request, Response, NextFunction } from 'express';
import { insertNoteVersion, getChangesSince } from '../services/notes.service.js';

export function pushNote(req: Request, res: Response, next: NextFunction): void {
    const { id, text, updatedAt, deviceId, deleted } = req.body;
    insertNoteVersion({ id, text, updatedAt, deviceId, deleted: deleted ?? false })
        .then(() => res.json({ ok: true }))
        .catch(next);
}

export function pullChanges(req: Request, res: Response, next: NextFunction): void {
    const since = Number(req.params.since);
    getChangesSince(since)
        .then(changes => res.json(changes))
        .catch(next);
}