import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/features/workspaces/api/use-delete-workspace';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
  // const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'this action is irreversible');
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();

  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          // router.replace('/');
          toast.success('workspace deleted');
        },
        onError: () => {
          toast.error('error deleting workspace');
        },
      }
    );
  };
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success('workspace updated');
        },
        onError: () => {
          toast.error('error something went wrong');
        },
      }
    );
    setEditOpen(false);
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog
        open={open}
        onOpenChange={setOpen}>
        <DialogContent className='p-0 bg-gray-50 overflow-hidden '>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog
              open={editOpen}
              onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className='bg-white py-4 px-5 border rounded-lg hover-bg-gray-50 cursor-pointer'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-bold'>workspace name</p>
                    <p className='text-sm text-[#126a3] hover:underline font-semibold'>Edit</p>
                  </div>
                  <p className='text-sm'>{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={e => setValue(e.target.value)}
                    minLength={3}
                    maxLength={80}
                    autoFocus
                    placeholder='Workspace name eg "Personal" "Home"'
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              className='flex items-center gap-x-2 py-4 px-5 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'
              disabled={isDeletingWorkspace}
              onClick={handleDelete}>
              <TrashIcon className='size-4' />
              <p className='text-sm font-semibold'>Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
