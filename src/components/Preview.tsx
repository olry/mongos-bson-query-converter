'use client';

import { highlight } from '@/utils/highlight.utils';
import { useLayoutEffect, useState } from 'react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

export default function Preview({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  const [nodes, setNodes] = useState(null);

  useLayoutEffect(() => {
    void highlight(value ?? '').then(setNodes as any);
  }, [value]);

  return (
    <Card className={cn('px-4 py-3 [&>pre]:h-full h-full', className)}>
      <ScrollArea>
        <div className="[&>pre]:bg-transparent [&>pre]:text-xs">{nodes}</div>
      </ScrollArea>
    </Card>
  );
}
