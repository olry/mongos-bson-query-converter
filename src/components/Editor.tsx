'use client';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import { Card } from './ui/card';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();
  useEffect(() => {
    highlighter.setTheme(theme === 'light' ? 'vitesse-light' : 'vitesse-dark');
  }, [theme]);
  useEffect(() => {
    if (!done && monaco) {
      done = true;
      shikiToMonaco(highlighter, monaco);
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);
  return (
    <Card className="h-full overflow-hidden">
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
        loading=""
        onChange={onChange}
      />
    </Card>
  );
}
