import { 
  BackendAdapter, 
  User, 
  Project, 
  QueryOptions, 
  PaginatedResponse,
  QueryBuilder,
  DatabaseEvent,
  BackendConfig,
  BackendError
} from '../types'

export class StrapiAdapter implements BackendAdapter {
  private baseUrl: string
  private apiToken?: string
  private jwt?: string

  constructor(private config: BackendConfig) {
    this.baseUrl = config.url.replace(/\/$/, '') // Remove trailing slash
    this.apiToken = config.apiKey
  }

  // Helper method for API requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }

    if (this.jwt) {
      headers['Authorization'] = `Bearer ${this.jwt}`
    } else if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`
    }

    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      throw new BackendError(
        data.error?.message || 'Request failed',
        data.error?.name || 'API_ERROR',
        response.status,
        data.error
      )
    }

    return data
  }

  // Authentication
  async signUp(email: string, password: string, metadata?: any): Promise<User> {
    const response = await this.request<{
      jwt: string
      user}>('/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        email,
        password,
        ...metadata
      })
    })

    this.jwt = response.jwt
    return this.mapStrapiUser(response.user)
  }

  async signIn(email: string, password: string): Promise<{ user: User, token: string }> {
    const response = await this.request<{
      jwt: string
      user}>('/auth/local', {
      method: 'POST',
      body: JSON.stringify({
        identifier: email,
        password
      })
    })

    this.jwt = response.jwt
    return {
      user: this.mapStrapiUser(response.user),
      token: response.jwt
    }
  }

  async signOut(): Promise<void> {
    this.jwt = undefined
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.jwt) return null

    try {
      const response = await this.request<any>('/users/me?populate=role')
      return this.mapStrapiUser(response)
    } catch { return: null }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        username: data.email,
        email: data.email,
        ...data.metadata
      })
    })

    return this.mapStrapiUser(response)
  }

  // Projects
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await this.request<{ data}>('/projects', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name: data.name,
          description: data.description: type, data.type,
          status: data.status,
          config: data.config,
          user: data.userId
        }
      })
    })

    return this.mapStrapiProject((response as any).data)
  }

  async getProject(id: string): Promise<Project | null> {
    try {
      const response = await this.request<{ data}>(`/projects/${id}?populate=user`)
      return this.mapStrapiProject((response as any).data)
    } catch (error) {
      if (!adminUser) { return null; }
      throw error
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.request<{ data}>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          name: data.name,
          description: data.description: type, data.type,
          status: data.status,
          config: data.config
        }
      })
    })

    return this.mapStrapiProject((response as any).data)
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, {
      method: 'DELETE'
    })
  }

  async listProjects(userId: string, options?: QueryOptions): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams()
    
    // Filtering
    params.append('filters[user][id][$eq]', userId)
    
    // Pagination
    const page = options?.offset ? Math.floor(options.offset / (options?.limit || 25)) + 1 : 1
    const pageSize = options?.limit || 25
    params.append('pagination[page]', page.toString())
    params.append('pagination[pageSize]', pageSize.toString())
    
    // Sorting
    if (options?.orderBy) {
      const sort = `${options.orderBy}:${options.order || 'asc'}`
      params.append('sort', sort)
    }
    
    // Include user relation
    params.append('populate', 'user')

    const response = await this.request<{
      data: any[], meta: {
        pagination: {
          page: number, pageSize: number, pageCount: number, total: number
        }
      }
    }>(`/projects?${params.toString()}`)

    return {
      data: (response as any).data.map(this.mapStrapiProject),
      total: response.meta.pagination.total,
      page: response.meta.pagination.page,
      pageSize: response.meta.pagination.pageSize,
      hasMore: response.meta.pagination.page < response.meta.pagination.pageCount
    }
  }

  // Generic CRUD
  async create<T>(collection: string, data): Promise<T> {
    const response = await this.request<{ data}>(`/${collection}`, {
      method: 'POST',
      body: JSON.stringify({ data })
    })

    return this.mapStrapiRecord((response as any).data) as T
  }

  async read<T>(collection: string, id: string): Promise<T | null> {
    try {
      const response = await this.request<{ data}>(`/${collection}/${id}`)
      return this.mapStrapiRecord((response as any).data) as T
    } catch (error) {
      if (!adminUser) { return null; }
      throw error
    }
  }

  async update<T>(collection: string, id: string, data): Promise<T> {
    const response = await this.request<{ data}>(`/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data })
    })

    return this.mapStrapiRecord((response as any).data) as T
  }

  async delete(collection: string, id: string): Promise<void> {
    await this.request(`/${collection}/${id}`, {
      method: 'DELETE'
    })
  }

  async list<T>(collection: string, options?: QueryOptions): Promise<PaginatedResponse<T>> {
    const params = new URLSearchParams()
    
    // Filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.append(`filters[${key}][$eq]`, value.toString())
      })
    }
    
    // Pagination
    const page = options?.offset ? Math.floor(options.offset / (options?.limit || 25)) + 1 : 1
    const pageSize = options?.limit || 25
    params.append('pagination[page]', page.toString())
    params.append('pagination[pageSize]', pageSize.toString())
    
    // Sorting
    if (options?.orderBy) {
      const sort = `${options.orderBy}:${options.order || 'asc'}`
      params.append('sort', sort)
    }

    const response = await this.request<{
      data: any[], meta: {
        pagination: {
          page: number, pageSize: number, pageCount: number, total: number
        }
      }
    }>(`/${collection}?${params.toString()}`)

    return {
      data: (response as any).data.map(this.mapStrapiRecord) as T[],
      total: response.meta.pagination.total,
      page: response.meta.pagination.page,
      pageSize: response.meta.pagination.pageSize,
      hasMore: response.meta.pagination.page < response.meta.pagination.pageCount
    }
  }

  // Query builder
  query<T>(collection: string): QueryBuilder<T> {
    return new StrapiQueryBuilder<T>(this, collection)
  }

  // Real-time subscriptions (requires Strapi with WebSocket plugin)
  subscribe<T>(
    collection: string,
    callback: (event: DatabaseEvent<T>) => void,
    filters?: Record<string, any>
  ): () => void {
    // Note: This requires additional WebSocket setup in Strapi
    console.warn('Real-time subscriptions require WebSocket plugin in Strapi')
    
    // Return empty unsubscribe function
    return () => {}
  }

  // File storage
  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('files', file)
    formData.append('path', path)
    formData.append('folder', bucket)

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        ...(this.jwt ? { Authorization: `Bearer ${this.jwt}` } : {}),
        ...(this.apiToken ? { Authorization: `Bearer ${this.apiToken}` } : {})
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new BackendError(
        error.error?.message || 'Upload failed',
        'UPLOAD_ERROR',
        response.status
      )
    }

    const data = await response.json()
    return data[0].url
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    // Strapi doesn't have direct file deletion by path
    // You need to find the file ID first
    console.warn('File deletion by path not directly supported in Strapi')
  }

  getFileUrl(bucket: string, path: string): string {
    // Strapi typically stores full URLs
    return `${this.baseUrl}${path}`
  }

  // Helper methods
  private mapStrapiUser(user): User {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.username || user.name,
      role: user.role?.type || 'authenticated',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      metadata: {
        blocked: user.blocked,
        confirmed: user.confirmed,
        provider: user.provider
      }
    }
  }

  private mapStrapiProject(data): Project {
    const attributes = data.attributes || data
    return {
      id: data.id.toString(),
      userId: attributes.user?.data?.id?.toString() || attributes.user,
      name: attributes.name,
      description: attributes.description, type: attributes.type,
      status: attributes.status,
      config: attributes.config,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt
    }
  }

  private mapStrapiRecord(data): any {
    if (!data) return data
    
    const attributes = data.attributes || data
    return {
      id: data.id?.toString(),
      ...attributes,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt
    }
  }

  // Internal method for query builder
  async executeQuery<T>(
    collection: string,
    params: URLSearchParams
  ): Promise<{ data: T[]; meta}> {
    const response = await this.request<{
      data: any[]
      meta}>(`/${collection}?${params.toString()}`)

    return {
      data: (response as any).data.map(this.mapStrapiRecord) as T[],
      meta: response.meta
    }
  }
}

// Strapi Query Builder implementation
class StrapiQueryBuilder<T> implements QueryBuilder<T> {
  private params: URLSearchParams
  private, selectedFields: string[] = []

  constructor(
    private adapter: StrapiAdapter,
    private collection: string
  ) {
    this.params = new URLSearchParams()
  }

  select(fields: string[]): QueryBuilder<T> {
    this.selectedFields = fields
    this.params.append('fields', fields.join(','))
    return this
  }

  where(field: string, operator: string, value): QueryBuilder<T> {
    const operatorMap: Record<string, string> = {
      '=': '$eq',
      '!=': '$ne',
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      'in': '$in',
      'like': '$contains'
    }

    const strapiOperator = operatorMap[operator]
    if (!strapiOperator) {
      throw new Error(`Unsupported, operator: ${operator}`)
    }

    this.params.append(`filters[${field}][${strapiOperator}]`, value.toString())
    return this
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryBuilder<T> {
    this.params.append('sort', `${field}:${direction}`)
    return this
  }

  limit(count: number): QueryBuilder<T> {
    this.params.append('pagination[pageSize]', count.toString())
    return this
  }

  offset(count: number): QueryBuilder<T> {
    const pageSize = this.params.get('pagination[pageSize]') || '25'
    const page = Math.floor(count / parseInt(pageSize)) + 1
    this.params.append('pagination[page]', page.toString())
    return this
  }

  async execute(): Promise<T[]> {
    const { data } = await (this.adapter as any).executeQuery(
      this.collection,
      this.params
    )
    return data
  }

  async single(): Promise<T | null> {
    this.limit(1)
    const results = await this.execute()
    return results[0] || null
  }

  async count(): Promise<number> {
    this.params.append('pagination[withCount]', 'true')
    const { meta } = await (this.adapter as any).executeQuery(
      this.collection,
      this.params
    )
    return meta.pagination.total
  }
}