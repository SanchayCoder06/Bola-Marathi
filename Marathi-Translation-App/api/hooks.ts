/**
 * BOLA Marathi — Centralized API Layer Hooks
 * Provides reusable hooks/state handlers for loading, errors, retries, and API execution.
 */

import { useState, useCallback } from 'react';
import { apiClient } from './client';
import {
  ApiState,
  TranslateRequest,
  TranslateResponse,
  DictionaryRequest,
  DictionaryResponse,
  AssessRequest,
  AssessResponse,
  CorrectRequest,
  CorrectResponse,
  DoubtRequest,
  DoubtResponse,
  AiRequest,
  AiResponse
} from './types';

/**
 * Generic API Mutation Hook
 */
export function useApiMutation<TReq, TRes>(
  apiFn: (req: TReq) => Promise<TRes>
) {
  const [state, setState] = useState<ApiState<TRes>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (req: TReq): Promise<TRes | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFn(req);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: any) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error: errorObj });
        return null;
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// --- SPECIFIC HOOKS ---

export function useTranslate() {
  return useApiMutation<TranslateRequest, TranslateResponse>(
    (req) => apiClient.translate(req)
  );
}

export function useDictionary() {
  return useApiMutation<DictionaryRequest, DictionaryResponse>(
    (req) => apiClient.dictionary(req)
  );
}

export function useAssess() {
  return useApiMutation<AssessRequest, AssessResponse>(
    (req) => apiClient.assess(req)
  );
}

export function useCorrect() {
  return useApiMutation<CorrectRequest, CorrectResponse>(
    (req) => apiClient.correct(req)
  );
}

export function useDoubt() {
  return useApiMutation<DoubtRequest, DoubtResponse>(
    (req) => apiClient.doubt(req)
  );
}

export function useAi() {
  return useApiMutation<AiRequest, AiResponse>(
    (req) => apiClient.ai(req)
  );
}
