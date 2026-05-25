import { diff } from 'deep-diff';
import { ExtendedAPIResponse } from './apiClient';
import { Helpers } from './helpers';
import { LATENCY_THRESHOLD_MS } from '../config/environments';

export interface ComparisonResult {
  passed: boolean;
  statusCodeMismatch: boolean;
  oldStatus: number;
  newStatus: number;
  latencyDelta: number;
  latencyWarning: boolean;
  diffs: any[] | null;
  sanitizedOld: any;
  sanitizedNew: any;
}

export class Comparator {
  static compare(
    oldRes: ExtendedAPIResponse,
    newRes: ExtendedAPIResponse,
    path: string
  ): ComparisonResult {
    const sanitizedOld = Helpers.sanitizePayload(oldRes.data, path);
    const sanitizedNew = Helpers.sanitizePayload(newRes.data, path);

    const changes = diff(sanitizedOld, sanitizedNew) || null;
    const statusCodeMismatch = oldRes.status !== newRes.status;
    const latencyDelta = newRes.duration - oldRes.duration;
    const latencyWarning = newRes.duration > LATENCY_THRESHOLD_MS;

    const passed = !statusCodeMismatch && !changes;

    return {
      passed,
      statusCodeMismatch,
      oldStatus: oldRes.status,
      newStatus: newRes.status,
      latencyDelta,
      latencyWarning,
      diffs: changes,
      sanitizedOld,
      sanitizedNew
    };
  }
}