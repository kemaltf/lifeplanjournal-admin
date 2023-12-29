'use client';

import { Plus } from 'lucide-react';
import { Heading } from '../../molecules/heading';
import { Button } from '../../button';
import { Separator } from '../../separator';
import { useParams, useRouter } from 'next/navigation';

export const Billboard = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading description="Manage billboards for your store" title="Billboards (0)"></Heading>
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4"></Plus>
          Add New
        </Button>
      </div>
      <Separator></Separator>
    </>
  );
};
