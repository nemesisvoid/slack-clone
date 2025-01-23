import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator, CommandItem } from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Info, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });

  const { data: members } = useGetMembers({ workspaceId });
  const [open, setOpen] = useState(false);

  return (
    <nav className='bg-[#481349] flex items-center justify-between gap-1.5 h-10'>
      <div className='flex-1 bg-red-100' />

      <div className='min-w-[280px] max-[642px] grow-[2] shrink'>
        <Button
          onClick={() => setOpen(true)}
          size='sm'
          className='bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2'>
          <Search className='size-4 text-white mr-2' />
          <span className='text-white text-sm'>Search {data?.name}</span>
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Channels'>
              {channels?.map(channel => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => setOpen(false)}
                  asChild>
                  <Link href={`/workspace/${workspaceId}/channel/${channel._id}`}>{channel.name}</Link>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading='Members'>
              <CommandSeparator />
              {members?.map(member => (
                <CommandItem
                  key={member._id}
                  onSelect={() => setOpen(false)}
                  asChild>
                  <Link href={`/workspace/${workspaceId}/member/${member._id}`}>{member.user.name}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className='ml-auto flex-1 flex items-center justify-end'>
        <Button
          variant='transparent'
          size='iconSm'>
          <Info className='size-5 text-white' />
        </Button>
      </div>
    </nav>
  );
};
