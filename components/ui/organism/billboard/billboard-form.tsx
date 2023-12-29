'use client';

import * as z from 'zod';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useOrigin } from '@/hooks/use-origin';

import { Heading } from '../../molecules/heading';
import { Button } from '../../button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../form';
import { Separator } from '../../separator';
import { Input } from '../../input';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '../modals/alert-modals';
import ImageUpload from '../uploadImage/image-upload';
import { ImageInfo } from '@/types/image-upload';

interface BillboardWithImages extends Omit<Billboard, 'imageUrl'> {
  imageUrl: ImageInfo[];
}
interface BillboardFormProps {
  initialData: BillboardWithImages | null;
}

const formSchema = z.object({
  label: z.string().min(3),
  imageUrl: z
    .array(
      z.object({
        id: z.string(),
        filename: z.string(),
        filetype: z.string(),
        fileimage: z.string(),
        datetime: z.string(),
        filesize: z.string(),
      })
    )
    .min(1, { message: 'At least 1 image is required.' }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard';
  const toastMessage = initialData ? 'Billboard updated.' : 'Billboard created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          label: initialData.label || '',
          imageUrl: initialData.imageUrl || [],
        }
      : {
          label: '',
          imageUrl: [],
        },
  });

  // Accessing specific properties from form
  const { setError, reset, formState, setValue, watch } = form;

  const imageUrlValue = watch('imageUrl');
  console.log(imageUrlValue);
  const onImageChange = useCallback(
    (images: ImageInfo[]) => {
      setValue('imageUrl', images);
    },
    [setValue]
  );

  // Accessing specific properties from formState
  const { errors, isSubmitting, isSubmitted } = formState;

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      console.log(data);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push('/');
      toast.success('Billboard deleted.');
    } catch (error) {
      console.log(error);
      toast.error('Make sure you remove all categories using this billboard first.');
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isSubmitting} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
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
        )}
      </div>
      <Separator></Separator>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="Billboard label" {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <ImageUpload loading={isSubmitting} onChange={onImageChange}></ImageUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator></Separator>
    </>
  );
};
