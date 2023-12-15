'use client';

// With Zod, you can define schemas for your data
// and then use the functions provided by Zod to validate whether
// the data conforms to the specified schema.
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
// use state management (using zustand)
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { signInSchema } from '@/lib/definitions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginForm = () => {
  // The useRouter hook allows you to programmatically change routes inside Client Components.
  const router = useRouter();

  // useSearchParams is a Client Component hook that lets you read the current URL's query string.
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';

  // kalo di useForm doang
  // const {
  //   handleSubmit,
  //   control,
  //   setError,
  //   reset,
  //   clearErrors,
  //   formState: { errors, isSubmitted },
  // } = useForm();

  // create form using react-hook-form & zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Accessing specific properties from form
  const { setError, reset, formState } = form;
  // Accessing specific properties from formState
  const { errors, isSubmitting, isSubmitted } = formState;

  // this useEffect is used to reset a field/state after it has been submitted
  useEffect(() => {
    if (isSubmitted) {
      reset({}, { keepErrors: true });
    }
  }, [isSubmitted, reset]);

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    console.log(values);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: values.username,
        password: values.password,
        callbackUrl,
      });

      // redirect callback url
      if (!res?.error) {
        toast.success('Success');
        router.push(callbackUrl);
      }

      // Manually set error based on the response
      // Ensure that the message is always a string
      const errorMessage = res?.error || '';

      // set error manually
      setError('password', { type: 'manual', message: errorMessage });
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="space-y-4 p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>

                  {errors.password && typeof errors.password.message === 'string' && <FormMessage>{errors.password.message}</FormMessage>}
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6" disabled={isSubmitting} type="submit">
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
};
