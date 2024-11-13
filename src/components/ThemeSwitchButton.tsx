import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

export default function ThemeSwitchButton() {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      variant="ghost"
      className="size-11"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
