"use client";

import { highlight } from "@/utils/highlight.utils";
import { useLayoutEffect, useState } from "react";

export default function Preview({ value }: { value?: string }) {
  const [nodes, setNodes] = useState(null);

  useLayoutEffect(() => {
    if (!value) return;
    void highlight(value).then(setNodes as any);
  }, [value]);

  return nodes ?? <p>Loading...</p>;
}
