/**
 * Icon Library
 * 
 * This file re-exports all icons from the modular icon system.
 * Icons are organized by category for better maintainability.
 * 
 * @see ./icons/index.ts for the complete export list
 */

export * from './icons';

// For backward compatibility, also export commonly used icons directly
export {
  // Base components
  Icon,
  type IconProps,
  
  // Technology
  AIIcon,
  CodeIcon,
  DatabaseIcon,
  CloudIcon,
  RocketIcon,
  
  // Navigation
  DashboardIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  SearchIcon,
  
  // Actions
  SaveIcon,
  TrashIcon,
  EditIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  PlusIcon,
  MinusIcon,
  
  // Status
  CheckIcon,
  CheckCircleIcon,
  XIcon,
  XCircleIcon,
  InfoIcon,
  WarningIcon,
  AlertCircleIcon,
  SpinnerIcon,
  LoadingIcon,
  BellIcon,
  
  // Business
  UserIcon,
  UsersIcon,
  ChartIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  
  // Media
  ImageIcon,
  VideoIcon,
  CameraIcon,
  FileIcon,
  FolderIcon
} from './icons';