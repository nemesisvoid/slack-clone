import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { type QuillOptions } from 'quill';

import { MdSend } from 'react-icons/md';
import 'quill/dist/quill.snow.css';
import { Button } from './ui/button';

import { PiTextAa } from 'react-icons/pi';
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { Hint } from './hint';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';
import { EmojiPopover } from './emoji-popover';
import Image from 'next/image';

type EditorValue = {
  image: File | null;
  body: string;
};
interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  placeholder?: string;
  onCancel?: () => void;
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  defaultValue?: Delta | Op[];
  variant: 'create' | 'update';
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholderRef = useRef(placeholder);
  const submitRef = useRef(onSubmit);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [['bold', 'italic', 'strike'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                // todo submit form
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ body, image: addedImage });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = '';
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toolbar = () => {
    setIsToolbarVisible(current => !current);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) toolbarElement.classList.toggle('hidden');
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill.getSelection()?.index || 0, emoji.native);
  };
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
  return (
    <div className='flex flex-col'>
      <input
        type='file'
        accept='image/*'
        onChange={e => setImage(e.target.files![0])}
        ref={imageElementRef}
        className='hidden'
      />
      <div
        className={cn(
          'flex flex-col border border-slate-300 bg-white rounded-md overflow-hidden focus-within:shadow-sm transition',
          disabled && 'opacity-50'
        )}>
        <div
          ref={containerRef}
          className='h-full ql-custom'
        />
        {!!image && (
          <div className='p-2'>
            <div className='relative size-[62px] flex items-center justify-center group/image'>
              <Hint label='Remove image'>
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className='hidden group-hover:/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 items-center justify-center'>
                  <XIcon className='size-3.5' />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt='uploaded image'
                fill
                className='rounded-xl overflow-hidden border  object-cover'
              />
            </div>
          </div>
        )}
        <div className='flex pb-2 px-2 z-[5]'>
          <Hint label={isToolbarVisible ? `Hide formatting` : 'Show formatting'}>
            <Button
              disabled={disabled}
              variant='ghost'
              size='iconSm'
              onClick={toolbar}>
              <PiTextAa className='size-4' />
            </Button>
          </Hint>

          {variant === 'create' && (
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button
                disabled={disabled}
                variant='ghost'
                size='iconSm'>
                <Smile className='size-4' />
              </Button>
            </EmojiPopover>
          )}
          {variant === 'create' && (
            <Hint label='Images'>
              <Button
                disabled={disabled}
                variant='ghost'
                size='iconSm'
                onClick={() => imageElementRef.current?.click()}>
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}

          {variant === 'update' && (
            <div className='ml-auto flex items-center gap-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={onCancel}
                disabled={disabled}>
                Cancel
              </Button>

              <Button
                className='bg-[#007a5a] hover:bg-[#007a5a]/80'
                variant='outline'
                size='sm'
                onClick={() => onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image })}
                disabled={disabled || isEmpty}>
                Save
              </Button>
            </div>
          )}

          {variant === 'create' && (
            <Hint label='Send message'>
              <Button
                className={cn('ml-auto', isEmpty ? ' bg-white hover:bg-white/80 text-muted-foreground' : 'bg-[#007a5a] hover:bg-[#007a5a]/80')}
                size='iconSm'
                onClick={() => onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image })}
                disabled={disabled || isEmpty}>
                <MdSend className='size-4' />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div className={cn(`p-2 text-[10px] text-muted-foreground flex justify-end opacity-0, transition`, !isEmpty && 'opacity-100')}>
          <p>
            <strong>Shift + Return</strong> add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
