import { clsx, type ClassValue } from 'clsx';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useToggle(defaultVal?: boolean) {
  const [val, setVal] = useState(defaultVal);
  const toggle = useCallback((newVal?: boolean) => {
    if (typeof newVal !== 'boolean') {
      setVal((currVal) => !currVal);
    } else {
      setVal(newVal);
    }
  }, []);
  return {
    isActive: val,
    toggle,
  };
}
