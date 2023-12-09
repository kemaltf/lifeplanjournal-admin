'use client';

/**
 * because we want to use use state and lifecycle event so we use use client
 */

import { useEffect } from 'react';

import { useStoreModal } from '@/hooks/use-store-modals';

export default function SetupPage() {
  // this will trigger modal component
  // doc: https://medium.com/@kemaltf_/memahami-kode-zustand-94c9d016a6ed
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <p>This page is should be protected!</p>
    </div>
  );
}
