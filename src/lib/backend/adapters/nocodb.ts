
import { BackendAdapter, User, Project, QueryOptions, PaginatedResponse, QueryBuilder, DatabaseEvent, BackendConfig, BackendError } from '../types';
import * as bcrypt from 'bcryptjs';
// UUID v4 generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
export class NocoDBAdapter implements BackendAdapter {
  private baseUrl: string;
  private apiToken: string;
  private projectId?: string;
  private authToken?: string;
  constructor(private config: BackendConfig) {
    if (!config.url || !config.apiKey) {
      throw new Error('NocoDB URL and API token are required');
    }
    this.baseUrl = config.url.replace(/\/$/, '');
    this.apiToken = config.apiKey;
    // Extract project ID from URL if provided
    const urlMatch = config.url.match(/\/api\/v1\/db\/data\/noco\/([^/]+)/);
    if (urlMatch) {
      this.projectId = urlMatch[1];
    }
  }
  // Helper method for API requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'xc-token': this.apiToken,
      ...(options.headers as Record<string, string> || {})
    };
    if (this.authToken) {
      headers['xc-auth'] = this.authToken;
    }
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers
    });
    const data = await response.json();
    if (!response.ok) {
      throw new BackendError(
        data.msg || data.message || 'Request failed',
        'API_ERROR',
        response.status,
        data
      );
    }
    return data;
  }
  // Get table API endpoint
  private getTableEndpoint(table: string): string {
    if (this.projectId) {
      return `/api/v1/db/data/noco/${this.projectId}/${table}`;
    }
    return `/api/v1/db/data/noco/${table}`;
  }
  // Authentication
  async signUp(email: string, password: string, metadata?: any): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user in users table
    const user = await this.request<any>(this.getTableEndpoint('users'), {
      method: 'POST',
      body: JSON.stringify({
        id: uuidv4(),
        email,
        password: hashedPassword,
        name: metadata?.name,
        role: metadata?.role || 'user',
        metadata: JSON.stringify(metadata || {}),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });
    return this.mapNocoDBUser(user);
  }
  async signIn(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const users = await this.request<any[]>(
      `${this.getTableEndpoint('users')}?where=(email,eq,${email})`
    );
    if (!users || users.length === 0) {
      throw new BackendError('Invalid credentials', 'AUTH_ERROR', 401);
    }
    const user = users[0];
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BackendError('Invalid credentials', 'AUTH_ERROR', 401);
    }
    // Generate token (in production, use proper JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    this.authToken = token;
    return {
      user: this.mapNocoDBUser(user),
      token
    };
  }
  async signOut(): Promise<void> {
    this.authToken = undefined;
  }
  async getCurrentUser(): Promise<User | null> {
    if (!this.authToken) return null;
    try {
      // Decode token to get user ID
      const decoded = Buffer.from(this.authToken, 'base64').toString();
      const [userId] = decoded.split(':');
      const user = await this.request<any>(
        `${this.getTableEndpoint('users')}/${userId}`
      );
      return this.mapNocoDBUser(user);
    } catch {
      return null;
    }
  }
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.role) updateData.role = data.role;
    if (data.metadata) updateData.metadata = JSON.stringify(data.metadata);
    const user = await this.request<any>(
      `${this.getTableEndpoint('users')}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      }
    );
    return this.mapNocoDBUser(user);
  }
  // Projects
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project = await this.request<any>(this.getTableEndpoint('projects'), {
      method: 'POST',
      body: JSON.stringify({
        id: uuidv4(),
        user_id: data.userId,
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
        config: JSON.stringify(data.config || {}),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });
    return this.mapNocoDBProject(project);
  }
  async getProject(id: string): Promise<Project | null> {
    try {
      const project = await this.request<any>(
        `${this.getTableEndpoint('projects')}/${id}`
      );
      return this.mapNocoDBProject(project);
    } catch (error) {
      if ((error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.type) updateData.type = data.type;
    if (data.status) updateData.status = data.status;
    if (data.config) updateData.config = JSON.stringify(data.config);
    const project = await this.request<any>(
      `${this.getTableEndpoint('projects')}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      }
    );
    return this.mapNocoDBProject(project);
  }
  async deleteProject(id: string): Promise<void> {
    await this.request(`${this.getTableEndpoint('projects')}/${id}`, {
      method: 'DELETE'
    });
  }
  async listProjects(userId: string, options?: QueryOptions): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    // Filtering
    params.append('where', `(user_id,eq,${userId})`)
    // Sorting
    if (options?.orderBy) {
      const order = options.order === 'desc' ? '-' : '';
      params.append('sort', `${order}${options.orderBy}`)
}
    // Pagination
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString());
    }
    const response = await this.request<{
      list: any[];
      pageInfo: {
        totalRows: number;
        page: number;
        pageSize: number;
        isFirstPage: boolean;
        isLastPage: boolean;
      };
    }>(`${this.getTableEndpoint('projects')}?${params.toString()}`)
    const page = Math.floor((options?.offset || 0) / (options?.limit || 25)) + 1;
    const pageSize = options?.limit || 25;
    return {
      data: response.list.map(this.mapNocoDBProject),
      total: response.pageInfo.totalRows,
      page,
      pageSize,
      hasMore: !response.pageInfo.isLastPage
    };
  }
  // Generic CRUD
  async create<T>(collection: string, data: any): Promise<T> {
    // Add metadata fields
    const createData = {
      ...data,
      id: data.id || uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const result = await this.request<any>(this.getTableEndpoint(collection), {
      method: 'POST',
      body: JSON.stringify(createData)
    });
    return this.mapNocoDBRecord(result) as T;
  }
  async read<T>(collection: string, id: string): Promise<T | null> {
    try {
      const result = await this.request<any>(
        `${this.getTableEndpoint(collection)}/${id}`
      );
      return this.mapNocoDBRecord(result) as T;
    } catch (error) {
      if ((error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
  async update<T>(collection: string, id: string, data: any): Promise<T> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString()
    };
    const result = await this.request<any>(
      `${this.getTableEndpoint(collection)}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      }
    );
    return this.mapNocoDBRecord(result) as T;
  }
  async delete(collection: string, id: string): Promise<void> {
    await this.request(`${this.getTableEndpoint(collection)}/${id}`, {
      method: 'DELETE'
    });
  }
  async list<T>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams();
    // Filters
    if (options?.filters) {
      const whereConditions = Object.entries(options.filters)
        .map(([key, value]) => `(${key},eq,${value})`)
        .join('~and');
      params.append('where', whereConditions);
    }
    // Sorting
    if (options?.orderBy) {
      const order = options.order === 'desc' ? '-' : '';
      params.append('sort', `${order}${options.orderBy}`)
}
    // Pagination
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.offset) {
      params.append('offset', options.offset.toString());
    }
    const response = await this.request<{
      list: any[];
      pageInfo: {
        totalRows: number;
        page: number;
        pageSize: number;
        isFirstPage: boolean;
        isLastPage: boolean;
      };
    }>(`${this.getTableEndpoint(collection)}?${params.toString()}`)
    const page = Math.floor((options?.offset || 0) / (options?.limit || 25)) + 1;
    const pageSize = options?.limit || 25;
    return {
      data: response.list.map(this.mapNocoDBRecord) as T[],
      total: response.pageInfo.totalRows,
      page,
      pageSize,
      hasMore: !response.pageInfo.isLastPage
    };
  }
  // Query builder
  query<T>(collection: string): QueryBuilder<T> {
    return new NocoDBQueryBuilder<T>(this, collection);
  }
  // Real-time subscriptions (NocoDB doesn't have built-in real-time)
  subscribe<T>(
    collection: string,
    callback: (event: DatabaseEvent<T>) => void,
    filters?: Record<string, any>
  ): () => void {
    console.warn('Real-time subscriptions not supported in NocoDB');
    return () => {};
  }
  // File storage
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    const response = await fetch(`${this.baseUrl}/api/v1/db/storage/upload`, {
      method: 'POST',
      headers: {
        'xc-token': this.apiToken
      },
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new BackendError(
        error.msg || 'Upload failed',
        'UPLOAD_ERROR',
        response.status
      );
    }
    const data = await response.json();
    return data.url || data.path;
  }
  async deleteFile(bucket: string, path: string): Promise<void> {
    // NocoDB file deletion would need to be implemented
    console.warn('File deletion not implemented for NocoDB');
  }
  getFileUrl(bucket: string, path: string): string {
    return `${this.baseUrl}/download/${path}`;
  }
  // Helper methods
  private mapNocoDBUser(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      metadata: user.metadata ? JSON.parse(user.metadata) : {}
    };
  }
  private mapNocoDBProject(project: any): Project {
    return {
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      type: project.type,
      status: project.status,
      config: project.config ? JSON.parse(project.config) : {},
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
  }
  private mapNocoDBRecord(record: any): any {
    // Parse any JSON fields
    const parsed = { ...record };
    // Common JSON fields
    ['config', 'metadata', 'data'].forEach((field) => {
      if (parsed[field] && typeof parsed[field] === 'string') {
        try {
          parsed[field] = JSON.parse(parsed[field]);
        } catch {
          // Keep as string if parsing fails
        }
      }
    });
    // Map snake_case to camelCase
    const mapped: any = {};
    for (const [key, value] of Object.entries(parsed)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      mapped[camelKey] = value;
    }
    return mapped;
  }
  // Internal method for query builder
  async executeQuery<T>(
    collection: string,
    params: URLSearchParams
  ): Promise<{ list: T[]; pageInfo: any }> {
    const response = await this.request<{
      list: any[];
      pageInfo: any;
    }>(`${this.getTableEndpoint(collection)}?${params.toString()}`);
    return {
      list: response.list.map(this.mapNocoDBRecord) as T[],
      pageInfo: response.pageInfo
    };
  }
}
// NocoDB Query Builder implementation
class NocoDBQueryBuilder<T> implements QueryBuilder<T> {
  private params: URLSearchParams;
  private whereConditions: string[] = [];
  constructor(
    private adapter: NocoDBAdapter,
    private collection: string
  ) {
    this.params = new URLSearchParams();
  }
  select(fields: string[]): QueryBuilder<T> {
    this.params.append('fields', fields.join(','));
    return this;
  }
  where(field: string, operator: string, value: any): QueryBuilder<T> {
    const operatorMap: Record<string, string> = {
      '=': 'eq',
      '!=': 'neq',
      '>': 'gt',
      '>=': 'gte',
      '<': 'lt',
      '<=': 'lte',
      'in': 'in',
      'like': 'like'
    };
    const nocoOperator = operatorMap[operator];
    if (!nocoOperator) {
      throw new Error(`Unsupported operator: ${operator}`);
    }
    this.whereConditions.push(`(${field},${nocoOperator},${value})`);
    return this;
  }
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    const order = direction === 'desc' ? '-' : '';
    this.params.append('sort', `${order}${field}`);
    return this;
  }
  limit(count: number): QueryBuilder<T> {
    this.params.append('limit', count.toString());
    return this;
  }
  offset(count: number): QueryBuilder<T> {
    this.params.append('offset', count.toString());
    return this;
  }
  async execute(): Promise<T[]> {
    // Apply where conditions
    if (this.whereConditions.length > 0) {
      this.params.append('where', this.whereConditions.join('~and'));
    }
    const { list } = await (this.adapter as any).executeQuery<T>(
      this.collection,
      this.params
    );
    return list;
  }
  async single(): Promise<T | null> {
    this.limit(1);
    const results = await this.execute();
    return results[0] || null;
  }
  async count(): Promise<number> {
    // Apply where conditions
    if (this.whereConditions.length > 0) {
      this.params.append('where', this.whereConditions.join('~and'));
    }
    const { pageInfo } = await (this.adapter as any).executeQuery<T>(
      this.collection,
      this.params
    );
    return pageInfo.totalRows;
  }
