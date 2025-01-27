interface ApiResponseHydration {
  kind: 'hydrate';
  hydration: boolean;
  new_content: string;
  new_route?: string;
  add_script?: string;
  parent_to_update: string;
}

interface ApiResponseNextRoute {
  kind: 'next';
  next_route: string;
}

interface ApiResponseAction {
  kind: 'action';
  error: null | boolean;
  stepDone: null | boolean;
  next: string;
  status: string;
  next_desc: null | string;
  nextQuickInfo: string[];
  nextErrors: string[];
  nextParams: {
    progressPercentage: number;
    [key: string]: unknown;
  };
}

export interface ApiError {
  code?: number;
  type?: string;
  requestParams?: XMLHttpRequest;
  additionalContents?: string | object;
}
export class SilencedApiError extends Error {}

export type ApiResponseUnknownObject = {
  kind?: Pick<ApiResponseHydration | ApiResponseNextRoute | ApiResponseAction, 'kind'>;
};
export type ApiResponseUnknown = string | ApiResponseUnknownObject | undefined;

type ApiResponse = ApiResponseHydration | ApiResponseNextRoute | ApiResponseAction;

export const APP_ERR_RESPONSE_BAD_TYPE = 'APP_ERR_RESPONSE_BAD_TYPE';
export const APP_ERR_RESPONSE_INVALID = 'APP_ERR_RESPONSE_INVALID';
export const APP_ERR_RESPONSE_EMPTY = 'APP_ERR_RESPONSE_EMPTY';

export type { ApiResponseHydration, ApiResponseNextRoute, ApiResponseAction, ApiResponse };
