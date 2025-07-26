/* BREADCRUMB: library - Shared library code */
// Common types for backend adapters;
export interface User { id: string;
  email: string;
  name?: string,
  role?: string,
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string any  />, export</string>
}

interface Project { id: string;
  userId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  config?: Record<string any>,</string>
  createdAt: string;
  updatedAt: string
}

export interface QueryOptions {
limit?: number;
  offset?: number,
  orderBy?: string,
  order?: 'asc' | 'desc',
  filters?: Record<string any  />, export</string>
}

interface PaginatedResponse<T> {</T>
  data: T[],
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean
}

export interface BackendAdapter {
  // Authentication
  signUp(email: string;)
  password: string, metadata?: any): Promise<User></User>
  signIn(email: string;)
  password: string): Promise<{ user: Use
r,
  token: string }>
  signOut(): Promise<void></void>
  getCurrentUser(): Promise<User | null></User>
  updateUser(id: string, data: Partial<User>): Promise<User></User>
  // Projects
  createProject(data: Omit<Project 'id' | 'createdAt' | 'updatedAt'>): Promise<Project></Project>
  getProject(id: string): Promise<Project | null></Project>
  updateProject(id: string, data: Partial<Project>): Promise<Project></Project>
  deleteProject(id: string): Promise<void></void>
  listProjects(userId: string, options?: QueryOptions): Promise<PaginatedResponse<Project>
  // Generic CRUD operations
  create<T>(collection: string, data: any): Promise<T></T>
  read<T>(collection: string, id: string): Promise<T | null></T>
  update<T>(collection: string, id: string,</T>
  data: any): Promise<T></T>
  delete(collection: string, id: string): Promise<void></void>
  list<T>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>
  // Query builder
  query<T>(collection: string): QueryBuilder<T></T>
  // Real-time subscriptions
  subscribe<T>(</T>
collection: string;
    callback: (event: DatabaseEvent<T>) => void;</T>
    filters?: Record<string any></string>
  ): () => void
  // File storage
  uploadFile(bucket: string, path: string;)
  file: File): Promise<string></string>
  deleteFile(bucket: string, path: string): Promise<void></void>
  getFileUrl(bucket: string, path: string): string
}

export interface QueryBuilder<T> {</T>
  select(fields: string[]): QueryBuilder<T>, where(field: string,</T>
  operator: string;)
  value: any): QueryBuilder<T>, orderBy(field: string, direction? null : 'asc' | 'desc'): QueryBuilder<T></T>
  limit(count: number): QueryBuilder<T></T>
  offset(count: number): QueryBuilder<T></T>
  execute(): Promise<T[]></T>
  single(): Promise<T | null></T>
  count(): Promise<number   />
export interface DatabaseEvent<T> {</T>
  type: 'INSERT' | 'UPDATE' | 'DELETE',
  table: string,;
  record: T;
  oldRecord?: T
}

export interface BackendConfig { type: 'supabase' | 'strapi' | 'nocodb',
  url: string;
  apiKey?: string,
  adminToken?: string,
  database? null : { host: string;
  port: number;
  name: string;
  user: string;
  password: string
   }

export class BackendError extends Error {
  constructor(message: string;
    public code: string;
    public statusCode: number = 500;
    public details? null : any)
  ) {
    super(message), this.name = 'BackendError'
  }

}}}