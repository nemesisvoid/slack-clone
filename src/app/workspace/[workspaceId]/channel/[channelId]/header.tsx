import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDeleteChannel } from '@/features/channels/api/use-delete-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useChannelId } from '@/hooks/use-channel-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTrigger, Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FaChevronDown } from 'react-icons/fa';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);

  const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();

  const { data: member } = useCurrentMember({ workspaceId });

  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'You are about to delete this channel');

  const { mutate: deleteChannel, isPending: isDeletingChannel } = useDeleteChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;

    setEditOpen(value);
  };
  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('channel deleted');
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('error deleting channel');
        },
      }
    );
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { name: value, id: channelId },
      {
        onSuccess: () => {
          toast.success('channel updated');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('something went wrong');
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  };

  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
      <Dialog>
        <ConfirmDialog />
        <DialogTrigger asChild>
          <Button
            className='text-lg font-semibold px-2 overflow-hidden w-auto'
            variant='ghost'
            size='sm'>
            <span className='truncate'># {title}</span>
            <FaChevronDown className='size-2.5 ml-2' />
          </Button>
        </DialogTrigger>
        <DialogContent className='p-0 bg-gray-100 overflow-hidden'>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>

          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog
              open={editOpen}
              onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Channel name</p>

                    {member?.role === 'admin' && <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>}
                  </div>
                  <p className='text-sm'># {title}</p>
                </div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>Rename this channel</DialogHeader>
                <form onSubmit={handleUpdate}>
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder='e.g "plan-budget"'
                  />
                </form>
              </DialogContent>
            </Dialog>

            {member?.role === 'admin' && (
              <button
                onClick={handleDelete}
                className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'
                disabled={isDeletingChannel}>
                <TrashIcon className='size-4' />
                <p className='text-sm font-semibold'>Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
