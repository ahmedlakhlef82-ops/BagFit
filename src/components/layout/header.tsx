'use client';

import Link from 'next/link';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { SearchInput } from '@/components/ui/search-input';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from '@/components/ui/drawer';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4 w-full justify-between md:justify-start">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/airlines"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Airlines
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex w-full max-w-sm">
            <SearchInput placeholder="Search airlines..." />
          </div>
          <nav className="flex items-center gap-2">
            <ThemeSwitcher />
            <Drawer>
              <DrawerTrigger>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
                <div className="p-4 space-y-4">
                  <Logo className="mb-8" />
                  <SearchInput placeholder="Search airlines..." />
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/airlines"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Airlines
                    </Link>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </nav>
        </div>
      </div>
    </header>
  );
}
