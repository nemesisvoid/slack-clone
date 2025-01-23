import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useCallback, useMemo, useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

type RequestType = {
  id: Id<'members'>;
  role: 'admin' | 'member';
};
type ResponseType = Id<'members'> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useUpdateMember = () => {
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

  const mutation = useMutation(api.members.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);

        setStatus('pending');
        const response = await mutation(values);
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
