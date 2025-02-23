import { toast } from 'react-toastify';

export function addToast<T extends (...args: any[]) => any>(
  fn: T,
  successMessage: string,
  errorMessage: string
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      const result = await fn(...args);
      successMessage && toast.success(successMessage);
      return result;
    } catch (error) {
      errorMessage && toast.error(errorMessage);
      console.error(errorMessage.toUpperCase(), error);
    }
    return undefined as Awaited<ReturnType<T>>;
  };
}
