"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ModelPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const modelType = pathname.split('/').pop();

  React.useEffect(() => {
    if (modelType === 'pose') {
      router.push('/phantoms/models/pose');
    } else if (modelType === 'classifier') {
      router.push('/phantoms/models/classifier');
    } else if (modelType === 'object') {
      router.push('/phantoms/models/object');
    }
  }, [modelType, router]);

  return <div>Loading...</div>; 
};

export default ModelPage;
