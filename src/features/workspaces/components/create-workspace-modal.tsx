import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateWorkspace } from '../api/use-create-workspace';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const CreateWorkSpaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState('');

  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  const { mutate, isPending } = useCreateWorkspace();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name },
      {
        onSuccess(id) {
          router.push(`/workspace/${id}`);
          handleClose();
          toast.success('workspace created');
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder='Workspace name e.g "Work", "Personal" '
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
