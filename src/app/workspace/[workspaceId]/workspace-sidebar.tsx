import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, Hash, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { WorkspaceSection } from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { UserItem } from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';

export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: isLoadingMember } = useCurrentMember({ workspaceId });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  const { data: channels, isLoading } = useGetChannels({ workspaceId });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const [_open, setOpen] = useCreateChannelModal();

  if (isLoadingMember || workspaceLoading)
    return (
      <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-start'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    );
  if (!member || !workspace)
    return (
      <div className='flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center'>
        <AlertTriangle className='size-5 text-white' />
        <p className='text-white text-sm'>workspace not found</p>
      </div>
    );

  return (
    <div className='flex flex-col'>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />

      <div className='flex flex-col px-2 mt-3'>
        <SidebarItem
          label='Threads'
          icon={MessageSquareText}
          id='threads'
        />
        <SidebarItem
          label='Drafts & Sent'
          icon={SendHorizonal}
          id='threads'
        />
      </div>

      <WorkspaceSection
        label='Channels'
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
        hint='New channel'>
        {channels?.map(item => (
          <SidebarItem
            key={item._id}
            label={item.name}
            icon={Hash}
            id={item._id}
            variant={channelId === item._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label='Direct messages'
        onNew={() => {}}
        hint='New direct message'>
        {members?.map(item => (
          <UserItem
            key={item._id}
            id={item._id}
            image={item.user.image}
            label={item.user.name}
            variant={item._id === memberId ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
