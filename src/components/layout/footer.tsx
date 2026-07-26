import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Travel smarter. Know your baggage allowance before you reach the
            airport.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/airlines"
                className="hover:text-primary transition-colors"
              >
                Airlines
              </Link>
            </li>
            <li>
              <Link
                href="/measure"
                className="hover:text-primary transition-colors"
              >
                Measure Bag
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BagFit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
