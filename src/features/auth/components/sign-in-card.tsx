import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuthActions } from '@convex-dev/auth/react';

import { SignInFlow } from '../types';
import { TriangleAlert } from 'lucide-react';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const handleProvider = (value: 'github' | 'google') => {
    setIsPending(true);
    signIn(value).finally(() => setIsPending(false));
  };

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => {
        setError('Invalid email or password');
      })
      .finally(() => setIsPending(false));
  };
  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your email or another service to continue</CardDescription>
      </CardHeader>
      {!!error && (
        <div className='bg-destructive/15 p-3 flex items-center gap-x-3 text-sm text-destructive mb-6'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-6 px-0 pb-0'>
        <form
          action=''
          onSubmit={onPasswordSignIn}
          className='space-y-3'>
          <Input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Email'
            required
            disabled={isPending}
          />
          <Input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password'
            required
            disabled={isPending}
          />

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={isPending}>
            Login
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button
            className='w-full relative'
            onClick={() => handleProvider('google')}
            variant='outline'
            size='lg'
            disabled={isPending}>
            <FcGoogle className='size-5 absolute left-2.5 top-2.5' />
            Continue with Google
          </Button>
          <Button
            className='w-full relative'
            onClick={() => handleProvider('github')}
            variant='outline'
            size='lg'
            disabled={isPending}>
            <FaGithub className='size-5 absolute left-2.5 top-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <span
            className='text-sky-700 underline cursor-pointer'
            onClick={() => setState('signUp')}>
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
