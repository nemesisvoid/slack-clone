'use client';

import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useChannelId } from '@/hooks/use-channel-id';

import { Loader, TriangleAlert } from 'lucide-react';
import { Header } from './header';
import { ChatInput } from './chat-input';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { MessageList } from '@/components/message-list';

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading } = useGetChannel({ id: channelId });

  if (isLoading || status === 'LoadingFirstPage')
    return (
      <div
        className='h-full flex flex-1 items-center justify-center
    '>
        <Loader className='animate-spin size-6 text-muted-foreground' />
      </div>
    );

  if (!channel)
    return (
      <div
        className='h-full flex gap-2 flex-1 items-center justify-center
    '>
        <TriangleAlert className='size-5 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'></span>
      </div>
    );

  return (
    <div className='flex flex-col h-full'>
      <Header title={channel.name} />
      <div className='flex-1' />

      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`message #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
