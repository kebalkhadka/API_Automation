import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';
import { Comparator } from '../utils/comparator';
import { OLD_BASE_URL, NEW_BASE_URL } from '../config/environments';
import apis from '../config/apis.json';

interface ApiDefinition {
  name: string;
  method: string;
  path: string;
  tags?: string[];
  params?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

test.describe.configure({ mode: 'parallel' });

// Dynamic Data-driven Automation Loop mapping 1000+ endpoints reliably
(apis as ApiDefinition[]).forEach((api) => {
  const normalizedTags = api.tags ? api.tags.map(t => `@${t}`).join(' ') : '';
  
  test(`Compare API [${api.method}] ${api.path} ${normalizedTags}`.trim(), async ({}, testInfo) => {
    // Isolated HTTP context allocations per worker thread instantiation
    const oldContext = await request.newContext();
    const newContext = await request.newContext();

    const oldClient = new ApiClient(oldContext, OLD_BASE_URL);
    const newClient = new ApiClient(newContext, NEW_BASE_URL);

    // Step 1 & 2: Execution dispatch pipeline
    const oldResponse = await test.step('Fetch Current production system target state', async () => {
      return await oldClient.execute(api.method, api.path, {
        params: api.params,
        body: api.body,
        headers: api.headers
      });
    });

    const newResponse = await test.step('Fetch New release target candidate state', async () => {
      return await newClient.execute(api.method, api.path, {
        params: api.params,
        body: api.body,
        headers: api.headers
      });
    });

    // Step 3: Normalization and deep matching analysis
    const comparison = await test.step('Sanitize and compare structural telemetry states', async () => {
      return Comparator.compare(oldResponse, newResponse, api.path);
    });

    // Attach contextual state for extraction inside reporting layer
    testInfo.annotations.push({
      type: 'comparison_meta',
      description: JSON.stringify({
        oldStatus: oldResponse.status,
        newStatus: newResponse.status,
        durationOld: oldResponse.duration,
        durationNew: newResponse.duration
      })
    });

    // Complete tracking attachments for investigative review within HTML or Allure formats
    await test.info().attach('Sanitized Production Payload', {
      body: JSON.stringify(comparison.sanitizedOld, null, 2),
      contentType: 'application/json'
    });

    await test.info().attach('Sanitized Candidate Release Payload', {
      body: JSON.stringify(comparison.sanitizedNew, null, 2),
      contentType: 'application/json'
    });

    if (comparison.diffs) {
      await test.info().attach('Structural Target Variance Diffs', {
        body: JSON.stringify(comparison.diffs, null, 2),
        contentType: 'application/json'
      });
    }

    // Assert validation thresholds securely
    if (comparison.latencyWarning) {
      test.info().annotations.push({
        type: 'performance_warning',
        description: `Candidate platform endpoint processing degradation: ${newResponse.duration}ms`
      });
    }

    expect(comparison.statusCodeMismatch, 
      `Status code variance hit: Old System returned [${comparison.oldStatus}], New System returned [${comparison.newStatus}]`
    ).toBe(false);

    expect(comparison.passed, 
      `Structural breaking variations caught between backend layers. Inspect generated diff attachments.`
    ).toBe(true);

    await oldContext.dispose();
    await newContext.dispose();
  });
});