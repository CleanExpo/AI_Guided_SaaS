'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger} from '@/components/ui/sheet';
import {
  Wrench,
  BarChart3,
  Users,
  FileText,
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Sparkles,
  Zap,
  Building,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Home,
  Settings} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const mainNavigation = [
  {
    name: 'Platform',
    href: '/',
    icon: Home,
    description: 'AI-powered development dashboard'},
  {
    name: 'UI Builder',
    href: '/ui-builder',
    icon: Wrench,
    description: 'Visual component builder'},
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance insights'},
  {
    name: 'Collaborate',
    href: '/collaborate',
    icon: Users,
    description: 'Team workspace'}];

const quickLinks = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Enterprise', href: '/enterprise', icon: Building }];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActivePath = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80, dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/20, dark:border-gray-800/20"
    >
      <div className="max-w-7xl mx-auto px-4, sm:px-6, lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden, sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Guided SaaS
                </div>
                <div className="text-xs text-gray-500, dark:text-gray-400 -mt-1">
                  Next-Gen Development
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden, lg:flex items-center space-x-1">
            {mainNavigation.map(item => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);

              return (
                <motion.div
                  key={item.name}
                  onHoverStart={() => setHoveredItem(item.name)}
                  onHoverEnd={() => setHoveredItem(null)}
                  whileHover={{ y: -2 }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100, dark:from-purple-900/30, dark:to-blue-900/30 text-purple-700, dark:text-purple-300'
                        : 'text-gray-600, dark:text-gray-300, hover:text-purple-600, dark:hover:text-purple-400, hover:bg-gray-100/50, dark:hover:bg-gray-800/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>

                  {hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900, dark:bg-gray-100 text-white, dark:text-gray-900 text-xs rounded-lg whitespace-nowrap z-50"
                    >
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900, dark:bg-gray-100 rotate-45"></div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* Quick Links Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-600, dark:text-gray-300, hover:text-purple-600, dark:hover:text-purple-400, hover:bg-gray-100/50, dark:hover:bg-gray-800/50"
                >
                  <span>More</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95, dark:bg-gray-950/95 backdrop-blur-xl border border-gray-200/20, dark:border-gray-800/20"
              >
                {quickLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link
                        href={link.href}
                        className="flex items-center space-x-3 px-3 py-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/pricing"
                    className="flex items-center space-x-3 px-3 py-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Pricing</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-xl bg-gray-100/50, dark:bg-gray-800/50, hover:bg-gray-200/50, dark:hover:bg-gray-700/50"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all, dark:-rotate-90, dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all, dark:rotate-0, dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>

            {/* User Menu or Auth */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 h-9 px-3 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100, dark:from-purple-900/30, dark:to-blue-900/30, hover:from-purple-200, hover:to-blue-200, dark:hover:from-purple-800/40, dark:hover:to-blue-800/40"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="hidden, md:inline-block text-sm font-medium text-purple-700, dark:text-purple-300">
                        {session.user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown className="h-3 w-3 text-purple-600, dark:text-purple-400" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95, dark:bg-gray-950/95 backdrop-blur-xl border border-gray-200/20, dark:border-gray-800/20"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600, dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden, md:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth/signin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-xl text-gray-600, dark:text-gray-300, hover:text-purple-600, dark:hover:text-purple-400"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/auth/signup">
                    <Button
                      size="sm"
                      className="h-9 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600, hover:from-purple-700, hover:to-blue-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden h-9 w-9 rounded-xl bg-gray-100/50, dark:bg-gray-800/50"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-white/95, dark:bg-gray-950/95 backdrop-blur-xl border-l border-gray-200/20, dark:border-gray-800/20"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      AI Guided SaaS
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through the platform
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-6">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900, dark:text-gray-100 uppercase tracking-wider">
                      Platform
                    </h3>
                    <div className="space-y-2">
                      {mainNavigation.map(item => {
                        const Icon = item.icon;
                        const isActive = isActivePath(item.href);

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center space-x-3 rounded-xl p-3 text-sm transition-all',
                              isActive
                                ? 'bg-gradient-to-r from-purple-100 to-blue-100, dark:from-purple-900/30, dark:to-blue-900/30 text-purple-700, dark:text-purple-300'
                                : 'text-gray-600, dark:text-gray-300, hover:bg-gray-100/50, dark:hover:bg-gray-800/50'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500, dark:text-gray-400">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900, dark:text-gray-100 uppercase tracking-wider">
                      Resources
                    </h3>
                    <div className="space-y-2">
                      {quickLinks.map(link => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-3 rounded-xl p-3 text-sm text-gray-600, dark:text-gray-300, hover:bg-gray-100/50, dark:hover:bg-gray-800/50 transition-all"
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Auth buttons for mobile */}
                  {!session && (
                    <div className="space-y-3 pt-6 border-t border-gray-200/20, dark:border-gray-800/20">
                      <Link
                        href="/auth/signin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full rounded-xl">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/auth/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600, hover:from-purple-700, hover:to-blue-700">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
