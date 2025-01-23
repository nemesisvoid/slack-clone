import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { SignInFlow } from '../types';
import { TriangleAlert } from 'lucide-react';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const handleProviderSignUp = (value: 'github' | 'google') => {
    setIsPending(true);
    signIn(value).finally(() => setIsPending(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('passwords do not match');
      return;
    }

    setIsPending(true);
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch(() => {
        setError('something went wrong');
      })
      .finally(() => setIsPending(false));
  };
  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Sign up to continue</CardTitle>
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
          onSubmit={onPasswordSignUp}
          className='space-y-3'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Full name'
            required
            disabled={isPending}
          />
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
          <Input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='Confirm Password'
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
            onClick={() => handleProviderSignUp('google')}
            variant='outline'
            size='lg'
            disabled={isPending}>
            <FcGoogle className='size-5 absolute left-2.5 top-2.5' />
            Continue with Google
          </Button>
          <Button
            className='w-full relative'
            onClick={() => handleProviderSignUp('github')}
            variant='outline'
            size='lg'
            disabled={isPending}>
            <FaGithub className='size-5 absolute left-2.5 top-2.5' />
            Continue with Github
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <span
            className='text-sky-700 underline cursor-pointer'
            onClick={() => setState('signIn')}>
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
