import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AvatarImage } from '@radix-ui/react-avatar';
import { FaChevronDown } from 'react-icons/fa';

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({ memberName, memberImage, onClick }: HeaderProps) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();
  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
      <Button
        className='text-lg px-3 overflow-hidden w-auto font-semibold'
        variant='ghost'
        onClick={onClick}>
        <Avatar>
          <AvatarImage src={memberImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='truncate ml-1'>{memberName}</span>
        <FaChevronDown className='size-2.5 ml-2' />
      </Button>
    </div>
  );
};
