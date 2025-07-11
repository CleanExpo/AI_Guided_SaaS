'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Settings,
  Users,
  BarChart3,
  Wrench,
  FileText,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Rocket,
  Shield,
  Building,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const mainNavigation = [
  {
    name: 'Platform',
    href: '/',
    icon: Home,
    description: 'Main dashboard and overview',
  },
  {
    name: 'UI Builder',
    href: '/ui-builder',
    icon: Wrench,
    description: 'Build and customize components',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance insights and metrics',
  },
  {
    name: 'Collaboration',
    href: '/collaborate',
    icon: Users,
    description: 'Team workspace and sharing',
  },
];

const resourcesNavigation = [
  {
    name: 'Templates',
    href: '/templates',
    icon: FileText,
    description: 'Pre-built project templates',
  },
  {
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
    description: 'Guides and API reference',
  },
  {
    name: 'Help Center',
    href: '/help',
    icon: HelpCircle,
    description: 'Support and tutorials',
  },
];

const enterpriseNavigation = [
  {
    name: 'Enterprise',
    href: '/enterprise',
    icon: Building,
    description: 'Enterprise solutions and pricing',
  },
  {
    name: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security features and compliance',
  },
  {
    name: 'Admin Panel',
    href: '/admin',
    icon: Settings,
    description: 'System administration',
  },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Logo variant="horizontal" size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Platform Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9">
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary-500/20 to-brand-primary-600/20 p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <Rocket className="h-6 w-6 text-brand-primary-600" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              AI Guided SaaS
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Intelligent development platform with AI-powered
                              automation
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        {mainNavigation.map(item => (
                          <NavigationMenuLink key={item.name} asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                isActivePath(item.href) &&
                                  'bg-accent text-accent-foreground'
                              )}
                            >
                              <div className="flex items-center space-x-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">
                                  {item.name}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      {resourcesNavigation.map(item => (
                        <NavigationMenuLink key={item.name} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              isActivePath(item.href) &&
                                'bg-accent text-accent-foreground'
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {item.name}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Enterprise Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9">
                    Enterprise
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px]">
                      {enterpriseNavigation.map(item => (
                        <NavigationMenuLink key={item.name} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              isActivePath(item.href) &&
                                'bg-accent text-accent-foreground'
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">
                                {item.name}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing Link */}
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), 'h-9')}
                    >
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User menu or auth buttons */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-brand-primary-500 flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="hidden md:inline-block text-sm font-medium">
                        {session.user?.name || session.user?.email}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="h-9">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="h-9">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Logo variant="icon" size="sm" />
                    <span>AI Guided SaaS</span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through the platform
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Platform Section */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      Platform
                    </h3>
                    <div className="space-y-2">
                      {mainNavigation.map(item => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                            isActivePath(item.href) &&
                              'bg-accent text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Resources Section */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      Resources
                    </h3>
                    <div className="space-y-2">
                      {resourcesNavigation.map(item => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                            isActivePath(item.href) &&
                              'bg-accent text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Enterprise Section */}
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                      Enterprise
                    </h3>
                    <div className="space-y-2">
                      {enterpriseNavigation.map(item => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                            isActivePath(item.href) &&
                              'bg-accent text-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Auth buttons for mobile */}
                  {!session && (
                    <div className="space-y-2 pt-4 border-t">
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
