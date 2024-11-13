'use client';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';

// Create the highlighter, it can be reused
const highlighter = await createHighlighter({
  themes: ['vitesse-dark', 'vitesse-light'],
  langs: ['javascript', 'typescript', 'vue'],
});
let done = false;
export default function Editor({
  onChange,
  value,
}: Parameters<typeof MonacoEditor>[0]) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!done && monaco) {
      done = true;
      shikiToMonaco(highlighter, monaco);
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);
  return (
    <MonacoEditor
      options={{
        minimap: {
          enabled: false,
        },
        padding: {
          top: 8,
        },
      }}
      height="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={onChange}
    />
  );
}
