'use client';

import { usePathname } from 'next/navigation';
import FloatingButtons from '@/components/FloatingButtons';

export default function ConditionalFloatingButtons() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }
  
  return <FloatingButtons />;
}







