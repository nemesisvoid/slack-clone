'use client';

import { UserButton } from '@/features/auth/components/user-button';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className='text-rose-500'>
      <UserButton />
    </div>
  );
}
