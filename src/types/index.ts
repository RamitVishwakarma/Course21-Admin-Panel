// Main entity types
export * from './Course';
export * from './Modules';
export * from './Lectures';
export * from './Users';
export * from './Roles';
export * from './Quiz';
export * from './Analytics';

// Re-export from Permission for backward compatibility
export * from './Permission';

// Frontend-only utility types
export interface PaginatedData<T = any> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchFilters {
  query?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

// Form states for frontend validation
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// Frontend CRUD operations (synchronous, localStorage-based)
export interface FrontendCrudOperations<T = any> {
  create: (data: Partial<T>) => T;
  read: (id: string) => T | null;
  update: (id: string, data: Partial<T>) => T;
  delete: (id: string) => boolean;
  list: (filters?: SearchFilters) => PaginatedData<T>;
  search: (query: string) => T[];
  filter: (predicate: (item: T) => boolean) => T[];
}

// Store states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface EntityState<T = any> extends LoadingState {
  items: T[];
  selectedItem: T | null;
  filters: SearchFilters;
  pagination: PaginatedData<T>['pagination'] | null;
}

// UI States
export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | 'view' | null;
  data: any;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  isVisible: boolean;
}

// Theme and UI preferences
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  sidebar: {
    isCollapsed: boolean;
    variant: 'default' | 'compact';
  };
}

// Navigation
export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: NavigationItem[];
  permissions?: string[];
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
}

// File upload
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
