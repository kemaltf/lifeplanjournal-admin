'use client'; //because we will use client component  (client interraction) such as popover

import { Store } from '@prisma/client';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { useStoreModal } from '@/hooks/use-store-modals';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../button';
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}
export default function StoreSwitcher({ className, items }: StoreSwitcherProps) {
  // zustand hook
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);
  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    // this will change our router client side
    router.push(`/${store.value}`);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store" className={cn('w-[200px] justify-between', className)}>
            <StoreIcon className="mr-4 h-4 w-4"></StoreIcon>
            {currentStore?.label}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Store.."></CommandInput>
              <CommandEmpty></CommandEmpty>
              <CommandGroup heading="Stores">
                {formattedItems.map((store) => (
                  <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm">
                    <StoreIcon className="mr-2 h-4 w-4"></StoreIcon>
                    {store.label}
                    <Check className={cn('ml-auto h-4 w-4', currentStore?.value === store.value ? 'opacity-100' : 'opacity-0')}></Check>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator></CommandSeparator>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    storeModal.onOpen();
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5"></PlusCircle>
                  Create New Store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
