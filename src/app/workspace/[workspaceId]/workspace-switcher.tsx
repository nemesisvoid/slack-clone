import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';

import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filteredWorkspaces = workspaces?.filter(works => works._id !== workspaceId);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className='size-9 relative overflow-hidden  text-slate-800 font-semibold bg-[#ABABAD] hover:bg-[#ABABAD]/80'>
            {workspaceLoading ? <Loader className='size-5 animate-spin' /> : workspace?.name.charAt(0).toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side='bottom'
          align='start'
          className='w-64'>
          <DropdownMenuItem
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className='cursor-pointer flex-col justify-start items-start capitalize'>
            {workspace?.name}
            <span className='text-xs text-muted-foreground'>active workspace</span>
          </DropdownMenuItem>

          {filteredWorkspaces?.map(workspace => (
            <DropdownMenuItem
              className='cursor-pointer capitalize overflow-hidden'
              key={workspace._id}
              onClick={() => router.push(`/workspace/${workspace._id}`)}>
              <div className='shrink-0 size-9 relative overflow-hidden  text-white text-lg font-semibold bg-[#616061]  rounded-md flex items-center justify-center mr-2'>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <p className='truncate'>{workspace.name}</p>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => setOpen(true)}>
            <div className='size-9 relative overflow-hidden  text-slate-800 text-lg font-semibold bg-[#F2F2F2]  rounded-md flex items-center justify-center mr-2'>
              <Plus />
            </div>
            Create new workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
