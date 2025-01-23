import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useCallback, useMemo, useState } from 'react';

type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<'success' | 'error' | 'pending' | 'settled' | 'idle' | null>(null);
  // const [isPending, setIsPending] = useState(false);
  // const [isSuccess, setIsSuccess] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [isSettled, setIsSettled] = useState(false);

  const isSettled = useMemo(() => status === 'settled', [status]);

  const isPending = useMemo(() => status === 'pending', [status]);

  const isError = useMemo(() => status === 'error', [status]);

  const isSuccess = useMemo(() => status === 'success', [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);

  const mutate = useCallback(
    async (_values: {}, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus('pending');
        const response = await mutation();
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus('error');
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        options?.onSettled?.();
        setStatus('settled');
      }
    },
    [mutation]
  );
  return { mutate, data, error, isPending, isError, isSuccess, isSettled };
};
