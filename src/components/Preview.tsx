'use client';

import { highlight } from '@/utils/highlight.utils';
import { useLayoutEffect, useState } from 'react';
import { Card } from './ui/card';

export default function Preview({ value }: { value?: string }) {
  const [nodes, setNodes] = useState(null);

  useLayoutEffect(() => {
    void highlight(value ?? '').then(setNodes as any);
  }, [value]);

  return (
    <Card className="px-4 py-2 rounded-md overflow-y-scroll [&>pre]:h-full [&>pre]:bg-transparent [&>pre]:text-xs h-full">
      {nodes ?? <p>Loading...</p>}
    </Card>
  );
}
