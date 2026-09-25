export interface ApiErrorBody {
  message?: string;
  code?: string;
  errorMessage?: string;
  errors?: Record<string, string[]>;
}