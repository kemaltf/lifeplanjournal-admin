'use client';

import axios from 'axios';
// With Zod, you can define schemas for your data
// and then use the functions provided by Zod to validate whether
// the data conforms to the specified schema.
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
// use state management (using zustand)
import { useState } from 'react';
// toast is for trigger the toaster
import { toast } from 'react-hot-toast';

import { useStoreModal } from '@/hooks/use-store-modals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Modal } from '@/components/ui/molecules/modal';

// define schema
const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  /**
   * 
useStore(): This is a hook that you create using create 
from Zustand to establish and manage a state store. 
This hook grants access to the state and functions 
responsible for updating the state.
   */

  // there are two method to get the state
  // 1. without selector function we will get all of the state
  const storeModal = useStoreModal();

  // 2. with selector function for specific state like this
  // const isOpen = useStoreModal((state) => state.isOpen);

  /**
   * 
useState() is one of the hooks provided by React for 
managing state in functional components. By using useState(),
you can introduce state to functional components and update 
the value of that state.
   */
  const [loading, setLoading] = useState(false);

  // define hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // test toaster if went error
      // throw new Error('x');
      const response = await axios.post('/api/stores', values);
      toast.success('Store created.');

      // complete refresh our page
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Store" description="Add a new store to manage products and categories" isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
      <div>
        <div className="space-y-4 py-2 pb-4">
          {/* Spread syntax is used because we want to take attribute */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* properti render menerima fungsi render yang memberikan akses ke object field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="E-Commerce" {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                  Cancel
                </Button>
                {/* it will automatically trigger onsubmit form because the type is submit */}
                <Button disabled={loading} type="submit">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
