'use client';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { Tabs } from '@/components/ui/tabs';
import { TITLE } from '@/constants';
import { cn, useToggle } from '@/lib/utils';
import {
  transformGoToMongoShell,
  transformToBsonGo,
} from '@/package/bson-mongos-converter';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import MongoSvg from '@/assets/mongo-bw.svg';
import ThemeSwitchButton from '@/components/ThemeSwitchButton';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import clsx from 'clsx';
import { Bug } from 'lucide-react';
import Markdown from 'react-markdown';
import LogoImage from '@/assets/logo.png';

const transformers = {
  bson: transformToBsonGo,
  mongos: transformGoToMongoShell,
};

const transformerKeys = Object.keys(transformers);

export default function Home() {
  const [value, setValue] = useState<string | undefined>('{}');
  const [error, setError] = useState('');
  const lastValidValueRef = useRef<string>();
  const [srcTransformType, setSrcTransformType] =
    useState<keyof typeof transformers>('mongos');
  const [dstTransformType, setDstTransformType] =
    useState<keyof typeof transformers>('bson');
  const transformer = useMemo(
    () => transformers[dstTransformType],
    [dstTransformType]
  );

  const whyState = useToggle();

  const transformedValue = useMemo(() => {
    try {
      const transformed = transformer(value ?? '{}');
      setError('');
      lastValidValueRef.current = transformed;
      return transformed;
    } catch (err: any) {
      setError(err?.message);
      return value;
    }
  }, [transformer, value]);
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-2/4 min-w-[400px] lg:min-w-[900px] gap-8 items-center sm:items-start mt-[16vh] relative">
        <div
          className={clsx(
            'flex flex-col w-full transition-all',
            whyState.isActive
              ? 'opacity-0 pointer-events-none scale-95'
              : 'opacity-100 scale-100'
          )}
        >
          <div className="flex w-full min-h-[360px] h-[42vh] gap-4">
            <div className="flex-1 flex flex-col">
              <TransformTypeSelection
                value={srcTransformType}
                onChange={(val) => {
                  if (val === dstTransformType) {
                    setDstTransformType(
                      transformerKeys.find((k) => k !== val) as any
                    );
                  }
                  setValue(transformedValue);
                  return setSrcTransformType(val);
                }}
              />
              <Editor
                focusOnLoad
                defaultLanguage={
                  srcTransformType === 'bson' ? 'go' : 'javascript'
                }
                language={srcTransformType === 'bson' ? 'go' : 'javascript'}
                onChange={(val) => {
                  setValue(val);
                }}
                value={value}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-end w-full">
                <TransformTypeSelection
                  value={dstTransformType}
                  onChange={(val) => {
                    if (val === srcTransformType) {
                      setSrcTransformType(
                        transformerKeys.find((k) => k !== val) as any
                      );
                    }
                    setValue(transformedValue);
                    return setDstTransformType(val);
                  }}
                />
              </div>
              <Preview
                value={error ? lastValidValueRef.current : transformedValue}
                className={error ? '[&>div]:opacity-40' : ''}
              />
            </div>
          </div>

          <div
            className={cn(
              'text-red-500 text-sm flex justify-end',
              error ? '' : 'opacity-0'
            )}
          >
            {error || '-'}
          </div>
        </div>
        <div
          className={clsx(
            'w-full flex justify-center absolute transition-all font-[family-name:var(--font-geist-mono)]',
            whyState.isActive
              ? 'opacity-100 -translate-y-0'
              : 'opacity-0 pointer-events-none translate-y-6 text-neutral-200'
          )}
        >
          <div className="max-w-[720px] w-full">
            <Markdown
              components={{
                a({ className, ...props }) {
                  return (
                    <a
                      {...props}
                      className={clsx(className, 'text-cyan-500 underline')}
                    />
                  );
                },
                p({ className, ...props }) {
                  return (
                    <p
                      {...props}
                      className={clsx(className, 'mb-6 text-sm')}
                    ></p>
                  );
                },
              }}
            >{`
Because writing BSON queries in Go is metal.

This tool serves as a convenience in constructing your mongoDB queries in Go code.

            `}</Markdown>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-6 md:text-3xl text-2xl gap-2">
          {/* <Image {...LogoImage} width={60} height={60} alt="logo" priority /> */}
          {TITLE}
        </div>
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        {/* <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol> */}

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div> */}
      </main>
      <div className="flex flex-wrap items-center justify-center gap-12">
        <div
          role="button"
          className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors text-neutral-800 hover:underline dark:hover:no-underline"
          onClick={() => whyState.toggle()}
        >
          {/* <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          /> */}
          Why?
        </div>
        <a
          className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors text-neutral-800 hover:underline dark:hover:no-underline"
          target="_blank"
          href="https://github.com/olry/mongos-bson-query-converter/issues/new"
          rel="noopener noreferrer"
        >
          <Bug size={16} />
          {/* <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          /> */}
          Report bug
        </a>
      </div>
      <div className="flex-1"></div>
      <footer className="fixed bottom-0 flex justify-end w-full md:px-12 px-6 gap-4 pb-4">
        <ThemeSwitchButton />
        <Button asChild className="p-3 h-11 w-11" variant="ghost">
          <Link
            href="https://github.com/olry/mongos-bson-query-converter"
            target="_blank"
            rel="noopener"
          >
            <GitHubLogoIcon className="size-full" />
          </Link>
        </Button>
      </footer>
    </div>
  );
}

function TransformTypeSelection<T extends string = keyof typeof transformers>({
  value,
  onChange,
}: {
  value: T;
  onChange(val: T): void;
}) {
  return (
    <Tabs
      className="w-fit mb-2"
      onValueChange={(val) => {
        onChange(val as any);
      }}
      value={value}
    >
      <Tabs.List className="grid w-full grid-cols-2">
        <Tabs.Trigger value="mongos">
          <Image src={MongoSvg} width={18} height={18} alt="mongo icon" />
          mongosh
        </Tabs.Trigger>
        <Tabs.Trigger value="bson" className="flex gap-1">
          <span className="text-white">
            <Image {...LogoImage} width={18} height={18} alt="BSON icon" />
          </span>
          BSON
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
}
