import { buttonVariants } from '@idiomax/ui/components/button';
import { ModeToggle } from '@idiomax/ui/components/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@idiomax/ui/components/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@idiomax/ui/components/sheet';
import { DollarSign, LogIn, Menu } from 'lucide-react';
import { useState } from 'react';

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: '#features',
    label: 'Funcionalidades',
  },
  {
    href: '#pricing',
    label: 'Preços',
  },
  {
    href: '#faq',
    label: 'FAQ',
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className='dark:bg-background sticky top-0 z-40 w-full border-b-[1px] bg-white dark:border-b-slate-700'>
      <NavigationMenu className='mx-auto'>
        <NavigationMenuList className='container mx-auto flex h-14 w-screen justify-between px-6 2xl:max-w-screen-xl'>
          <NavigationMenuItem className='flex font-bold'>
            <a
              rel='noreferrer noopener'
              href='/'
              className='ml-2 flex place-items-center gap-3 text-xl font-bold'>
              <img src='/images/logo3-without-bg.png' className='size-10' alt='Logo IdiomaX' />
              IdiomaX
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className='flex md:hidden'>
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className='px-2'>
                <Menu className='flex h-5 w-5 md:hidden' onClick={() => setIsOpen(true)}>
                  <span className='sr-only'>Menu</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className='text-xl font-bold'>IdiomaX</SheetTitle>
                </SheetHeader>
                <nav className='mt-4 flex flex-col items-center justify-center gap-2'>
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel='noreferrer noopener'
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`w-8/12 font-semibold ${buttonVariants({ variant: 'outline' })}`}>
                      {label}
                    </a>
                  ))}
                  <a
                    rel='noreferrer noopener'
                    href='/'
                    className={`absolute bottom-50 w-[110px] border ${buttonVariants({
                      variant: 'default',
                    })}`}>
                    <DollarSign className='mr-2 h-5 w-5' />
                    Contratar
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className='hidden gap-2 md:flex'>
            {routeList.map((route: RouteProps, i) => (
              <a
                rel='noreferrer noopener'
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: 'ghost',
                })}`}>
                {route.label}
              </a>
            ))}
          </nav>

          <div className='hidden gap-2 md:flex'>
            <ModeToggle />
            <a
              rel='noreferrer noopener'
              href='/'
              className={`border ${buttonVariants({ variant: 'secondary' })}`}>
              <LogIn className='mr-2 h-5 w-5' />
              Logar
            </a>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
