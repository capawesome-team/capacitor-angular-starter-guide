export type RepositoryReadStatus = 'ok' | 'not-found' | 'error';

export interface RepositoryReadResult<T> {
  status: RepositoryReadStatus;
  data: T | null;
  error?: unknown;
}
