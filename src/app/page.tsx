'use client';

import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      console.log(workspaceId);
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
      console.log('create workspace');
    }
  }, [workspaceId, isLoading, open, setOpen, router]);
  return (
    <div className='h-full flex items-center justify-center'>
      <Loader className='size-10 animate-spin text-muted-foreground' />
    </div>
  );
}
