import { ReactNode, HTMLAttributes } from "react";
import {
  Post,
  PostWithAuthor,
  PostWithRelations,
  Comment,
  CommentWithRelations,
  Category,
  Tag,
  User,
} from "./index";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

export interface NavbarProps extends BaseComponentProps {
  user?: User | null;
  isAdmin?: boolean;
}

export interface FooterProps extends BaseComponentProps {
  siteName?: string;
  socialLinks?: SocialLink[];
}

export interface SidebarProps extends BaseComponentProps {
  categories?: Category[];
  popularPosts?: PostWithAuthor[];
  recentPosts?: PostWithAuthor[];
}

// Post component props
export interface PostCardProps extends BaseComponentProps {
  post: PostWithAuthor;
  featured?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  priority?: boolean; // For image loading
}

export interface PostListProps extends BaseComponentProps {
  posts: PostWithAuthor[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface PostContentProps extends BaseComponentProps {
  post: PostWithRelations;
  showComments?: boolean;
  showRelatedPosts?: boolean;
}

export interface HeroPostProps extends BaseComponentProps {
  post: PostWithAuthor;
}

export interface FeaturedPostsProps extends BaseComponentProps {
  posts: PostWithAuthor[];
  title?: string;
}

// Comment component props
export interface CommentSectionProps extends BaseComponentProps {
  postId: string;
  comments: CommentWithRelations[];
  user?: User | null;
  onCommentAdded?: (comment: Comment) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
}

export interface CommentItemProps extends BaseComponentProps {
  comment: CommentWithRelations;
  depth?: number;
  maxDepth?: number;
  currentUser?: User | null;
  onReply?: (parentId: string) => void;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: string) => void;
}

export interface CommentFormProps extends BaseComponentProps {
  postId: string;
  parentId?: string;
  initialContent?: string;
  onSubmit?: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitText?: string;
}

// Form component props
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void | Promise<void>;
  loading?: boolean;
  error?: string;
  success?: string;
}

export interface InputProps
  extends Omit<HTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export interface TextareaProps
  extends Omit<HTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  rows?: number;
  onChange?: (value: string) => void;
}

export interface SelectProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

// Auth component props
export interface LoginFormProps extends FormProps {
  redirectTo?: string;
  showSocialAuth?: boolean;
}

export interface RegisterFormProps extends FormProps {
  redirectTo?: string;
  showSocialAuth?: boolean;
}

export interface SocialAuthButtonsProps extends BaseComponentProps {
  providers?: ("github" | "google")[];
  redirectTo?: string;
}

export interface UserProfileProps extends BaseComponentProps {
  user: User;
  onSignOut?: () => void;
}

export interface AuthGuardProps extends BaseComponentProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
}

// Admin component props
export interface AdminLayoutProps extends LayoutProps {
  user: User;
  currentPath?: string;
}

export interface AdminSidebarProps extends BaseComponentProps {
  currentPath?: string;
  user: User;
}

export interface DataTableProps<T> extends BaseComponentProps {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  selection?: {
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
  };
  actions?: DataTableAction<T>[];
}

export interface DataTableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableAction<T> {
  label: string;
  icon?: string;
  onClick: (item: T) => void;
  variant?: "default" | "destructive" | "outline";
  disabled?: (item: T) => boolean;
}

export interface PostEditorProps extends BaseComponentProps {
  post?: Post;
  onSave?: (post: Post) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export interface RichTextEditorProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  toolbar?: string[];
}

// UI component props
export interface ButtonProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  children: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "pulse";
}

export interface EmptyStateProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

// Search and filter component props
export interface SearchBarProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export interface FilterBarProps extends BaseComponentProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset?: () => void;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange" | "text";
  options?: SelectOption[];
  placeholder?: string;
}

// Image component props
export interface OptimizedImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
}

export interface ImageUploadProps extends BaseComponentProps {
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  value?: string;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

// Theme component props
export interface ThemeProviderProps extends BaseComponentProps {
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

export interface ThemeToggleProps extends BaseComponentProps {
  variant?: "default" | "icon";
}

// Utility types for components
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export interface StatsCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartProps extends BaseComponentProps {
  data: any[];
  type: "line" | "bar" | "pie" | "area";
  xKey?: string;
  yKey?: string;
  title?: string;
  height?: number;
}

// Event handler types
export type ClickHandler = () => void | Promise<void>;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler<T = any> = (data: T) => void | Promise<void>;
export type ErrorHandler = (error: Error) => void;
