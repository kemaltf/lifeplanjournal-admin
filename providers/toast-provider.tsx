'use client';

import { Toaster } from 'react-hot-toast';

/**
 *
 * The purpose of this ToasterProvider is to provide and make it easy to use the
 *  Toaster component from the react-hot-toast library throughout the application.
 *
 * The purpose making this provider so we can adjust the toaster if in the future
 * we have something upgrade.
 * @returns <Toaster />
 *
 */
export const ToasterProvider = () => {
  return <Toaster />;
};
