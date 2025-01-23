import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusIcon, PlusSquareIcon } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';

type WorkspaceSectionProps = {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
};
export const WorkspaceSection = ({ children, label, hint, onNew }: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className='flex flex-col mb-3 px-2 py-4'>
      <div className='flex items-center px-3.5 group'>
        <Button
          onClick={toggle}
          variant='transparent'
          className='p-0.5 text-sm shrink-0 text-[#f9edffcc] size-6'>
          <FaCaretDown className={cn('size-4 transition-transform', on && '-rotate-90')} />
        </Button>
        <Button
          variant='transparent'
          size='sm'
          className='group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start items-center overflow-hidden'>
          <span className='truncate'>{label}</span>
        </Button>

        {onNew && (
          <Hint
            label={hint}
            side='top'
            align='center'>
            <Button
              onClick={onNew}
              variant='transparent'
              size='iconSm'
              className='opacity-0 group-hover:opacity-100 ml-auto  transition-opacity p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0
              '>
              <PlusIcon />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
