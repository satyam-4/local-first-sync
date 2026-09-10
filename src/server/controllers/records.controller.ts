import type { Request, Response, NextFunction } from 'express';
import { insertRecord, getChangesSince, groupByCollection } from '../services/records.service.js';
import type { PushRecordRequest } from '../types/record.js';

export function pushRecord(req: Request, res: Response, next: NextFunction): void {
    const records: PushRecordRequest[] = req.body;
    
    if (!Array.isArray(records)) {
        res.status(400).json({ error: 'Expected an array of records' });
        return;
    }

    insertRecord(records)
        .then(() => res.json({ ok: true }))
        .catch(next);
}

export function pullChanges(req: Request, res: Response, next: NextFunction): void {
    const since = Number(req.params.since);
    getChangesSince(since)
        .then(rows => res.json(groupByCollection(rows)))
        .catch(next);
}