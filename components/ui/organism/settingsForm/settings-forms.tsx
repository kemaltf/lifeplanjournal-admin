'use client';

import { Store } from '@prisma/client';
import * as z from 'zod';

import { Heading } from '../../molecules/heading';
import { Button } from '../../button';
import { Trash } from 'lucide-react';
import { Separator } from '../../separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../form';
import { Input } from '../../input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '../modals/alert-modals';
import { ApiAlert } from '../../molecules/api-alert';
import { useOrigin } from '@/hooks/use-origin';

interface SettingFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Accessing specific properties from form
  const { setError, reset, formState } = form;
  // Accessing specific properties from formState
  const { errors, isSubmitting, isSubmitted } = formState;

  const onSubmit = async (data: SettingFormValues) => {
    console.log(data);
    try {
      await axios.patch(`api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('Store updated');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Store deleted.');
    } catch (error) {
      console.log(error);
      toast.error('Make sure you remove all products and categories first.');
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isSubmitting} />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={isSubmitting}
          variant={'destructive'}
          size={'icon'}
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash className="h-4 w-4"></Trash>
        </Button>
      </div>
      <Separator></Separator>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="Store name" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator></Separator>
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  );
};
