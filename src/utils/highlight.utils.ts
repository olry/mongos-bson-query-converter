import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { codeToHast } from 'shiki/bundle/full';

export async function highlight(code: string, theme?: string) {
  const outRaw = await codeToHast(code, {
    lang: 'go',
    theme: theme === 'dark' ? 'github-dark' : 'github-light',
    transformers: [
      {
        pre(hast) {
          console.log('whut', hast);
          hast.properties.style = '';
        },
      },
    ],
  });

  return toJsxRuntime(outRaw, {
    Fragment,
    jsx,
    jsxs,
  });
}
