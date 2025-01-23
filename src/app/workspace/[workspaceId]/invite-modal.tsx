import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';

interface InviteModalProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  name: string;
  joinCode: string;
}
const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This will deactivate the current invite code and generate a new one');
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useNewJoinCode();

  const handleRefreshCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('invite code regenerated');
        },
        onError: () => {
          toast.error('invite code generation failed');
        },
      }
    );
  };
  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success('invite link copied to clipboard');
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog
        open={open}
        onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>use the code below to invite people to your workspace</DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
            <p className='text-4xl font-bold uppercase tracking-widest'>{joinCode}</p>
            <Button
              onClick={handleCopyLink}
              variant='ghost'
              size='sm'
              disabled={isPending}>
              Copy link
              <CopyIcon className='ml-3 size-4' />
            </Button>
          </div>

          <div className='flex items-center justify-between w-full'>
            <Button
              onClick={handleRefreshCode}
              variant='outline'
              disabled={isPending}>
              New Code
              <RefreshCcw className='size-4 ml-4' />
            </Button>
            <DialogClose asChild>
              <Button disabled={isPending}>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
