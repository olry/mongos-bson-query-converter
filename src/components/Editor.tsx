"use client";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { createHighlighter } from "shiki";
import { shikiToMonaco } from "@shikijs/monaco";

// Create the highlighter, it can be reused
const highlighter = await createHighlighter({
  themes: ["vitesse-dark", "vitesse-light"],
  langs: ["javascript", "typescript", "vue"],
});
let done = false;
export default function Editor({
  onChange,
}: {
  onChange?: Parameters<typeof MonacoEditor>[0]["onChange"];
}) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!done && monaco) {
      done = true;
      shikiToMonaco(highlighter, monaco);
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);
  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onChange={onChange}
    />
  );
}
