'use client';
import MonacoEditor, { useMonaco, Monaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';
import { Card } from './ui/card';
import { useTheme } from 'next-themes';

// Create the highlighter, it can be reused
const highlighter = (
  global.window
    ? await createHighlighter({
        themes: ['vitesse-dark', 'vitesse-light'],
        langs: ['javascript', 'typescript', 'vue'],
      })
    : undefined
) as Awaited<ReturnType<typeof createHighlighter>>;

export default function Editor({
  focusOnLoad,
  ...editorProps
}: Parameters<typeof MonacoEditor>[0] & {
  focusOnLoad?: boolean;
}) {
  const monaco = useMonaco();
  const { theme } = useTheme();
  useEffect(() => {
    monaco?.editor.setTheme(
      theme === 'light' ? 'vitesse-light' : 'vitesse-dark'
    );
  }, [monaco, theme]);

  const editorRef =
    useRef<ReturnType<Monaco['editor']['getEditors']>[number]>();

  return (
    <Card className="flex-1 overflow-hidden">
      <MonacoEditor
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          shikiToMonaco(highlighter, monaco);
          monaco.editor.setTheme(
            theme === 'light' ? 'vitesse-light' : 'vitesse-dark'
          );
          monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
            true
          );
          if (focusOnLoad) {
            editor.focus();
          }
        }}
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
        loading=""
        {...editorProps}
      />
    </Card>
  );
}
