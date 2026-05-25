import { GLOBAL_EXCLUDED_FIELDS, ENDPOINT_EXCLUSIONS } from '../config/exclusions';

export class Helpers {
  /**
   * Deeply sanitizes target payloads by stripping excluded keys and re-sorting arrays 
   * to guarantee order-agnostic matches.
   */
  static sanitizePayload(payload: any, path: string): any {
    if (payload === null || payload === undefined) return payload;

    // Merge global metrics configurations with selective explicit mutations
    const localExclusions = ENDPOINT_EXCLUSIONS[path] || [];
    const absoluteExclusions = new Set([...GLOBAL_EXCLUDED_FIELDS, ...localExclusions]);

    const clean = (item: any): any => {
      if (Array.isArray(item)) {
        // Deep map and sort array entries deterministically if they are primitive or objects
        const mappedArray = item.map(el => clean(el));
        return mappedArray.sort((a, b) => {
          const strA = typeof a === 'object' ? JSON.stringify(a) : String(a);
          const strB = typeof b === 'object' ? JSON.stringify(b) : String(b);
          return strA.localeCompare(strB);
        });
      }

      if (typeof item === 'object' && item !== null) {
        const copy: Record<string, any> = {};
        for (const key of Object.keys(item)) {
          if (!absoluteExclusions.has(key)) {
            copy[key] = clean(item[key]);
          }
        }
        return copy;
      }

      return item;
    };

    return clean(payload);
  }
}