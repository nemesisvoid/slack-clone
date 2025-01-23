'use client';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { Loader, TriangleAlert } from 'lucide-react';
import { useCurrentMember } from '@/features/members/api/use-current-member';

const Workspace = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !member || memberLoading || !workspace) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [workspace, workspaceId, workspaceLoading, router, channelId, channelsLoading, isAdmin, memberLoading, member, open, setOpen]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className='h-full flex flex-1 items-center justify-center flex-col gap-2'>
        <Loader className='size-7 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!workspace || !member)
    return (
      <div className='h-full flex flex-1 items-center justify-center flex-col gap-2'>
        <TriangleAlert className='size-7 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>workspace not found</span>
      </div>
    );

  return (
    <div className='h-full flex flex-1 items-center justify-center flex-col gap-2'>
      <TriangleAlert className='size-7 text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>no channel found</span>
    </div>
  );
};

export default Workspace;
