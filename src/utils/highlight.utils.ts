import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";

export async function highlight(code: string) {
  const outRaw = await codeToHast(code, {
    lang: "ts",
    theme: "github-dark",
  });

  return toJsxRuntime(outRaw, {
    Fragment,
    jsx,
    jsxs,
  });
}
