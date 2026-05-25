/**
 * Fields that should be stripped recursively from responses before deep-diff analysis.
 * Supports exact string match or regex patterns.
 */
export const GLOBAL_EXCLUDED_FIELDS: string[] = [
  "timestamp",
  "requestId",
  "serverTime",
  "updatedAt",
  "createdAt",
  "id", // Toggle off if strict payload matching on specific IDs is required
  "etag"
];

/**
 * Endpoint-specific exclusions to granularly preserve integrity across unique sub-trees
 */
export const ENDPOINT_EXCLUSIONS: Record<string, string[]> = {
  "/users": ["website"],
  "/orders": ["trackingId", "estimatedDelivery"]
};