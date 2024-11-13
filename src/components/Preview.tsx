'use client';

import { highlight } from '@/utils/highlight.utils';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useTheme } from 'next-themes';

export default function Preview({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  const [nodes, setNodes] = useState(null);
  const { theme } = useTheme();
  useEffect(() => {
    void highlight(value ?? '', theme).then(setNodes as any);
  }, [theme, value]);

  return (
    <Card className={cn('px-4 py-3 [&>pre]:h-full h-full', className)}>
      <ScrollArea>
        <div className="[&>pre]:bg-transparent [&>pre]:text-xs">{nodes}</div>
      </ScrollArea>
    </Card>
  );
}
