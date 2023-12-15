'use client';
// separate global import and local import by adding 1 empty line
import { useEffect, useState } from 'react';

import { StoreModal } from '@/components/ui/organism/modals/store-modals';
// since we want this modal appear on all of pages, so we need to create "provider"
// to show in layout

export const ModalProvider = () => {
  // since we want to put this provider inside layout.tsx which is server component.
  // it means we can't just add client component to it.
  // we have to ensure this not will hydration error
  // so we ensure lifecyle for the client side only after the component is mounted.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal></StoreModal>
    </>
  );
};
