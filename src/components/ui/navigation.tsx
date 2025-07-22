'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MenuIcon,
  CloseIcon} from './icons';
import { ButtonEnhanced } from './button-enhanced';

// Breadcrumb Components
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
}

export function Breadcrumb({
  items,
  separator = <ChevronRightIcon size="sm" />,
  className,
  maxItems = 5}: BreadcrumbProps) {
  const displayItems =
    items.length > maxItems
      ? [
          items[0],
          { label: '...', href: undefined },
          ...items.slice(-(maxItems - 2))]
      : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)}>
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (</li>
              <span className="mx-2 text-muted-foreground">{separator}</span>
            )}

            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'flex items-center text-sm font-medium',
                  item.current
                    ? 'text-foreground'
                    : item.label === '...'
                      ? 'text-muted-foreground cursor-default'
                      : 'text-muted-foreground'
                )}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    );
}

// Auto Breadcrumb (generates from pathname)
interface AutoBreadcrumbProps {
  className?: string;
  homeLabel?: string;
  homeHref?: string;
  pathMapping?: Record<string, string>;
}

export function AutoBreadcrumb({
  className,
  homeLabel = 'Home',
  homeHref = '/',
  pathMapping = {}}: AutoBreadcrumbProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: homeLabel, href: homeHref }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Use custom mapping or format segment
      const label =
        pathMapping[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast});
    });

    return breadcrumbs;
  };
</string>
  return <Breadcrumb items={generateBreadcrumbs()} className={className} />;
}

// Navigation Menu Components
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

interface NavigationMenuProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  onItemClick?: (item: NavItem) => void;
}

export function NavigationMenu({
  items,
  orientation = 'horizontal',
  variant = 'default',
  className,
  onItemClick}: NavigationMenuProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = React.useState<Set<string>>(
    new Set()
  );

  const toggleDropdown = (label: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(label)) {
      newOpenDropdowns.delete(label);
    } else {
      newOpenDropdowns.add(label);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  const variantClasses = {
    default: {
      container: '',
      item: 'px-3 py-2 rounded-md text-sm font-medium transition-colors',
      active:
        'bg-brand-primary-100 text-brand-primary-900, dark:bg-brand-primary-900, dark:text-brand-primary-100',
      inactive: 'text-muted-foreground, hover:text-foreground, hover:bg-accent'},
    pills: {
      container:
        'bg-brand-secondary-100, dark:bg-brand-secondary-800 p-1 rounded-lg',
      item: 'px-3 py-2 rounded-md text-sm font-medium transition-colors',
      active: 'bg-background text-foreground shadow-sm',
      inactive: 'text-muted-foreground, hover:text-foreground'},
    underline: {
      container: 'border-b border-border',
      item: 'px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent',
      active: 'text-brand-primary-600 border-brand-primary-600',
      inactive:
        'text-muted-foreground, hover:text-foreground, hover:border-border'}};

  const currentVariant = variantClasses[variant];

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.has(item.label);
    const active = isActive(item.href);

    const itemContent = (</Set>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-brand-primary-600 text-white rounded-full">
              {item.badge}</span>
          )}
        </div>
        {hasChildren && (
          <ChevronDownIcon
            size="sm"
            className={cn(
              'transition-transform',
              isDropdownOpen && 'rotate-180'
            )}
          />
        )}</ChevronDownIcon>
    );
    const itemClasses = cn(
      currentVariant.item,
      active ? currentVariant.active : currentVariant.inactive,
      item.disabled && 'opacity-50 cursor-not-allowed',
      level > 0 && 'ml-4',
      'relative'
    );

    return (
      <div key={item.label}>
        {item.href && !hasChildren ? (</div>
          <Link
            href={item.href}
            className={itemClasses}
            onClick={() => onItemClick?.(item)}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
          >
            {itemContent}</Link>
        ) : (
          <button
            className={itemClasses}
            onClick={() => {
              if (hasChildren) {
                toggleDropdown(item.label);
             }
              onItemClick?.(item);
            }}
            disabled={item.disabled}
          >
            {itemContent}</button>
        )}

        {hasChildren && isDropdownOpen && (
          <div
            className={cn(
              'mt-1 space-y-1',
              orientation === 'horizontal' &&
                'absolute top-full left-0 bg-background border rounded-md shadow-lg p-1 min-w-48 z-50'
            )}
          >
            {item.children!.map(child => renderNavItem(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={cn(
        'flex',
        orientation === 'horizontal'
          ? 'flex-row space-x-1'
          : 'flex-col space-y-1',
        currentVariant.container,
        className
      )}
    >
      {items.map(item => renderNavItem(item))}</nav>
    );
}

// Mobile Navigation
interface MobileNavigationProps {
  items: NavItem[];
  trigger?: React.ReactNode;
  className?: string;
  onItemClick?: (item: NavItem) => void;
}

export function MobileNavigation({
  items,
  trigger,
  className,
  onItemClick}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleItemClick = (item: NavItem) => {
    onItemClick?.(item);
    if (item.href) {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger */}</div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-accent"
        aria-label="Toggle navigation menu"
      ></button>
        {trigger || (isOpen ? <CloseIcon size="md" /> : <MenuIcon size="md" />)}</MenuIcon>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu */}</div>
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-accent"
            ></button>
              <CloseIcon size="md" />
            </button>

          <NavigationMenu
            items={items}
            orientation="vertical"
            onItemClick={handleItemClick}
          />
        </div>
    );
</div>
}

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
    >
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (</nav>
        <ButtonEnhanced
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
        >
          First</ButtonEnhanced>
      )}

      {/* Previous Page */}
      {showPrevNext && currentPage > 1 && (
        <ButtonEnhanced
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous</ButtonEnhanced>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (</React>
            <ButtonEnhanced
              variant={page === currentPage ? 'brand' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}</ButtonEnhanced>
          ) : (
            <span className="px-3 py-2 text-sm text-muted-foreground">
              {page}</span>
          )}
        </React.Fragment>
      ))}

      {/* Next Page */}
      {showPrevNext && currentPage < totalPages && (
        <ButtonEnhanced
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next</ButtonEnhanced>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <ButtonEnhanced
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          Last</ButtonEnhanced>
      )}
    </nav>
    );
}

// Tabs Component
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Tabs({
  items,
  activeTab,
  onTabChange,
  variant = 'default',
  orientation = 'horizontal',
  className}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    activeTab || items[0]?.id
  );

  const currentActiveTab = activeTab || internalActiveTab;

  const handleTabChange = (tabId: string) => {
    setInternalActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const variantClasses = {
    default: {
      container: 'border-b border-border',
      tab: 'px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent',
      active: 'text-brand-primary-600 border-brand-primary-600',
      inactive:
        'text-muted-foreground, hover:text-foreground, hover:border-border'},
    pills: {
      container:
        'bg-brand-secondary-100, dark:bg-brand-secondary-800 p-1 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium transition-colors rounded-md',
      active: 'bg-background text-foreground shadow-sm',
      inactive: 'text-muted-foreground, hover:text-foreground'},
    underline: {
      container: '',
      tab: 'px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent',
      active: 'text-brand-primary-600 border-brand-primary-600',
      inactive: 'text-muted-foreground, hover:text-foreground'}};

  const currentVariant = variantClasses[variant];
  const activeItem = items.find(item => item.id === currentActiveTab);

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}</div>
      <div
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          currentVariant.container
        )}
      >
        {items.map(item => (</div>
          <button
            key={item.id}
            onClick={() => !item.disabled && handleTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              currentVariant.tab,
              item.id === currentActiveTab
                ? currentVariant.active
                : currentVariant.inactive,
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          ></button>
            <div className="flex items-center">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-brand-primary-600 text-white rounded-full">
                  {item.badge}</span>
              )}
            </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeItem?.content && <div className="mt-4">{activeItem.content}</div>}
    </div>
    );
}
