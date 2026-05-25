import { APIRequestContext, APIResponse } from '@playwright/test';
import { GLOBAL_HEADERS,GLOBAL_TIMEOUT } from '../config/environments';
import { Logger } from './logger';

export interface ExtendedAPIResponse {
  status: number;
  data: any;
  duration: number;
  headers: Record<string, string>;
}

export class ApiClient {
  constructor(private context: APIRequestContext, private baseUrl: string) {}

  async execute(
    method: string,
    path: string,
    options: { params?: any; body?: any; headers?: Record<string, string> } = {}
  ): Promise<ExtendedAPIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = { ...GLOBAL_HEADERS, ...options.headers };
    
    const startTime = performance.now();
    let response: APIResponse;

    try {
      response = await this.context.fetch(url, {
        method: method,
        params: options.params,
        data: options.body,
        headers: mergedHeaders,
        timeout: GLOBAL_TIMEOUT
      });
    } catch (error: any) {
      Logger.error(`Network call execution failed safely on ${method} -> ${url}`, error);
      throw error;
    }

    const duration = Math.round(performance.now() - startTime);
    
    let data: any;
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    return {
      status: response.status(),
      data,
      duration,
      headers: response.headers()
    };
  }
}