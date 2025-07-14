# Best Practices - Multi-Agent Development Patterns

## 🎯 PURPOSE
Comprehensive collection of proven patterns, best practices, and lessons learned from multi-agent development projects for cross-project knowledge sharing and continuous improvement.

---

## 🏗️ ARCHITECTURAL PATTERNS

### **Microservices Architecture**
```typescript
// Service Discovery Pattern
interface ServiceRegistry {
  register(service: ServiceInfo): void
  discover(serviceName: string): ServiceInfo[]
  healthCheck(serviceId: string): boolean
}

// Circuit Breaker Pattern
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private failureCount = 0
  private readonly threshold = 5
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN')
    }
    
    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
}
```

### **Event-Driven Architecture**
```typescript
// Event Sourcing Pattern
interface Event {
  id: string
  type: string
  aggregateId: string
  data: any
  timestamp: Date
  version: number
}

class EventStore {
  async append(streamId: string, events: Event[]): Promise<void>
  async getEvents(streamId: string, fromVersion?: number): Promise<Event[]>
  async subscribe(eventType: string, handler: EventHandler): Promise<void>
}

// CQRS Pattern
interface Command {
  type: string
  payload: any
}

interface Query {
  type: string
  parameters: any
}

class CommandHandler {
  async handle(command: Command): Promise<void>
}

class QueryHandler {
  async handle(query: Query): Promise<any>
}
```

---

## 🎨 FRONTEND PATTERNS

### **Component Composition**
```typescript
// Compound Component Pattern
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export const Tabs = ({ children, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab)
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

Tabs.List = ({ children }: { children: ReactNode }) => (
  <div className="tabs-list">{children}</div>
)

Tabs.Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext)
  return (
    <button
      className={`tab ${context?.activeTab === value ? 'active' : ''}`}
      onClick={() => context?.setActiveTab(value)}
    >
      {children}
    </button>
  )
}

Tabs.Panel = ({ value, children }: TabPanelProps) => {
  const context = useContext(TabsContext)
  return context?.activeTab === value ? <div>{children}</div> : null
}
```

### **State Management Patterns**
```typescript
// Zustand Store Pattern
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
  
  // Actions
  setUser: (user: User | null) => void
  toggleTheme: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  theme: 'light',
  notifications: [],
  
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}))

// Custom Hook Pattern
export const useAuth = () => {
  const { user, setUser } = useAppStore()
  
  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials)
    setUser(user)
    return user
  }, [setUser])
  
  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [setUser])
  
  return { user, login, logout, isAuthenticated: !!user }
}
```

---

## ⚙️ BACKEND PATTERNS

### **Repository Pattern**
```typescript
// Generic Repository Interface
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>
  findAll(options?: FindOptions): Promise<T[]>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: ID, updates: Partial<T>): Promise<T>
  delete(id: ID): Promise<void>
}

// Implementation
class UserRepository implements Repository<User, string> {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] || null
  }
  
  // ... other methods
}

// Service Layer Pattern
class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}
  
  async createUser(userData: CreateUserData): Promise<User> {
    // Validation
    await this.validateUserData(userData)
    
    // Business logic
    const hashedPassword = await this.hashPassword(userData.password)
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      emailVerified: false
    })
    
    // Side effects
    await this.emailService.sendWelcomeEmail(user.email)
    this.logger.info('User created', { userId: user.id })
    
    return user
  }
}
```

### **Middleware Patterns**
```typescript
// Authentication Middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded as User
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
}

// Rate Limiting Middleware
export const rateLimiter = (options: RateLimitOptions) => {
  const store = new Map<string, { count: number; resetTime: number }>()
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip
    const now = Date.now()
    const windowMs = options.windowMs
    const maxRequests = options.max
    
    const record = store.get(key)
    
    if (!record || now > record.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' })
    }
    
    record.count++
    next()
  }
}

// Error Handling Middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error', { error: error.message, stack: error.stack })
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message, details: error.details })
  }
  
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message })
  }
  
  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message })
  }
  
  res.status(500).json({ error: 'Internal server error' })
}
```

---

## 🧪 TESTING PATTERNS

### **Test Organization**
```typescript
// Test Factory Pattern
class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      name: faker.name.fullName(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    }
  }
  
  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides))
  }
}

// Test Builder Pattern
class UserBuilder {
  private user: Partial<User> = {}
  
  withEmail(email: string): this {
    this.user.email = email
    return this
  }
  
  withName(name: string): this {
    this.user.name = name
    return this
  }
  
  asAdmin(): this {
    this.user.role = 'admin'
    return this
  }
  
  build(): User {
    return UserFactory.create(this.user)
  }
}

// Usage
const adminUser = new UserBuilder()
  .withEmail('admin@example.com')
  .withName('Admin User')
  .asAdmin()
  .build()
```

### **Integration Testing**
```typescript
// Test Database Setup
class TestDatabase {
  private static instance: TestDatabase
  private pool: Pool
  
  static async getInstance(): Promise<TestDatabase> {
    if (!this.instance) {
      this.instance = new TestDatabase()
      await this.instance.initialize()
    }
    return this.instance
  }
  
  async initialize(): Promise<void> {
    this.pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL
    })
    await this.runMigrations()
  }
  
  async cleanup(): Promise<void> {
    await this.pool.query('TRUNCATE TABLE users, projects, sessions CASCADE')
  }
  
  async close(): Promise<void> {
    await this.pool.end()
  }
}

// Test Suite Setup
describe('UserService Integration Tests', () => {
  let testDb: TestDatabase
  let userService: UserService
  
  beforeAll(async () => {
    testDb = await TestDatabase.getInstance()
    userService = new UserService(
      new UserRepository(testDb),
      new MockEmailService(),
      new MockLogger()
    )
  })
  
  beforeEach(async () => {
    await testDb.cleanup()
  })
  
  afterAll(async () => {
    await testDb.close()
  })
  
  it('should create user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    }
    
    const user = await userService.createUser(userData)
    
    expect(user.email).toBe(userData.email)
    expect(user.password).not.toBe(userData.password)
    expect(user.emailVerified).toBe(false)
  })
})
```

---

## 🚀 DEPLOYMENT PATTERNS

### **Blue-Green Deployment**
```yaml
# GitHub Actions Workflow
name: Blue-Green Deployment

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Application
        run: |
          npm ci
          npm run build
          npm run test
      
      - name: Deploy to Green Environment
        run: |
          # Deploy to green environment
          kubectl apply -f k8s/green-deployment.yaml
          kubectl wait --for=condition=available deployment/app-green
      
      - name: Run Health Checks
        run: |
          # Wait for health checks to pass
          ./scripts/health-check.sh green
      
      - name: Switch Traffic
        run: |
          # Switch traffic from blue to green
          kubectl patch service app-service -p '{"spec":{"selector":{"version":"green"}}}'
      
      - name: Cleanup Blue Environment
        run: |
          # Keep blue for rollback, cleanup after delay
          sleep 300
          kubectl delete deployment app-blue
```

### **Infrastructure as Code**
```hcl
# Terraform Configuration
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }
  
  depends_on = [aws_lb_listener.app]
}

# Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.max_capacity
  min_capacity       = var.min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_up" {
  name               = "${var.project_name}-scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

---

## 📊 MONITORING PATTERNS

### **Observability Stack**
```typescript
// Structured Logging
class Logger {
  private winston: winston.Logger
  
  constructor(service: string) {
    this.winston = winston.createLogger({
      defaultMeta: { service },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
      ]
    })
  }
  
  info(message: string, meta: object = {}) {
    this.winston.info(message, meta)
  }
  
  error(message: string, error?: Error, meta: object = {}) {
    this.winston.error(message, { error: error?.message, stack: error?.stack, ...meta })
  }
  
  // Request correlation
  withCorrelationId(correlationId: string) {
    return {
      info: (message: string, meta: object = {}) => 
        this.info(message, { correlationId, ...meta }),
      error: (message: string, error?: Error, meta: object = {}) => 
        this.error(message, error, { correlationId, ...meta })
    }
  }
}

// Metrics Collection
class MetricsCollector {
  private prometheus = require('prom-client')
  
  private httpRequestDuration = new this.prometheus.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code']
  })
  
  private httpRequestTotal = new this.prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  })
  
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration)
    
    this.httpRequestTotal
      .labels(method, route, statusCode.toString())
      .inc()
  }
  
  getMetrics() {
    return this.prometheus.register.metrics()
  }
}
```

---

## 🔒 SECURITY PATTERNS

### **Authentication & Authorization**
```typescript
// JWT Token Management
class TokenService {
  private readonly accessTokenExpiry = '15m'
  private readonly refreshTokenExpiry = '7d'
  
  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: this.accessTokenExpiry }
    )
    
    const refreshToken = jwt.sign(
      { userId: user.id, tokenType: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: this.refreshTokenExpiry }
    )
    
    return { accessToken, refreshToken }
  }
  
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any
      
      if (decoded.tokenType !== 'refresh') {
        throw new Error('Invalid token type')
      }
      
      const user = await this.userService.findById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }
      
      return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: this.accessTokenExpiry }
      )
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }
}

// Role-Based Access Control
class AuthorizationService {
  private permissions = new Map<string, string[]>([
    ['admin', ['read', 'write', 'delete', 'manage_users']],
    ['editor', ['read', 'write']],
    ['viewer', ['read']]
  ])
  
  hasPermission(userRole: string, requiredPermission: string): boolean {
    const rolePermissions = this.permissions.get(userRole) || []
    return rolePermissions.includes(requiredPermission)
  }
  
  requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as User
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      
      if (!this.hasPermission(user.role, permission)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }
      
      next()
    }
  }
}
```

---

## 📈 PERFORMANCE PATTERNS

### **Caching Strategies**
```typescript
// Multi-Level Caching
class CacheService {
  constructor(
    private memoryCache: NodeCache,
    private redisCache: Redis,
    private logger: Logger
  ) {}
  
  async get<T>(key: string): Promise<T | null> {
    // L1: Memory cache
    const memoryResult = this.memoryCache.get<T>(key)
    if (memoryResult) {
      this.logger.debug('Cache hit: memory', { key })
      return memoryResult
    }
    
    // L2: Redis cache
    const redisResult = await this.redisCache.get(key)
    if (redisResult) {
      const parsed = JSON.parse(redisResult) as T
      // Populate memory cache
      this.memoryCache.set(key, parsed, 300) // 5 minutes
      this.logger.debug('Cache hit: redis', { key })
      return parsed
    }
    
    this.logger.debug('Cache miss', { key })
    return null
  }
  
  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    // Set in both caches
    this.memoryCache.set(key, value, Math.min(ttl, 300))
    await this.redisCache.setex(key, ttl, JSON.stringify(value))
    this.logger.debug('Cache set', { key, ttl })
  }
  
  async invalidate(pattern: string): Promise<void> {
    // Invalidate memory cache
    this.memoryCache.flushAll()
    
    // Invalidate Redis cache
    const keys = await this.redisCache.keys(pattern)
    if (keys.length > 0) {
      await this.redisCache.del(...keys)
    }
    
    this.logger.info('Cache invalidated', { pattern, keysCount: keys.length })
  }
}

// Database Query Optimization
class OptimizedRepository {
  constructor(private db: Database, private cache: CacheService) {}
  
  async findUserWithProjects(userId: string): Promise<UserWithProjects | null> {
    const cacheKey = `user:${userId}:with-projects`
    
    // Try cache first
    const cached = await this.cache.get<UserWithProjects>(cacheKey)
    if (cached) return cached
    
    // Optimized query with joins
    const result = await this.db.query(`
      SELECT 
        u.id, u.email, u.name, u.created_at,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'status', p.status,
            'created_at', p.created_at
          )
        ) FILTER (WHERE p.id IS NOT NULL) as projects
      FROM users u
      LEFT JOIN projects p ON u.id = p.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.email, u.name, u.created_at
    `, [userId])
    
    const user = result.rows[0] || null
    
    if (user) {
      // Cache for 1 hour
      await this.cache.set(cacheKey, user, 3600)
    }
    
    return user
  }
}
```

---

## 🔄 ERROR HANDLING PATTERNS

### **Resilience Patterns**
```typescript
// Retry with Exponential Backoff
class RetryService {
  async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries: number
      baseDelay: number
      maxDelay: number
      backoffFactor: number
    }
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === options.maxRetries) {
          break
        }
        
        const delay = Math.min(
          options.baseDelay * Math.pow(options.backoffFactor, attempt),
          options.maxDelay
        )
        
        await this.sleep(delay)
      }
    }
    
    throw lastError!
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Graceful Degradation
class FeatureService {
  constructor(
    private primaryService: PrimaryService,
    private fallbackService: FallbackService,
    private circuitBreaker: CircuitBreaker
  ) {}
  
  async getRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      // Try primary service (AI-powered recommendations)
      return await this.circuitBreaker.execute(() =>
        this.primaryService.getRecommendations(userId)
      )
    } catch (error) {
      // Fallback to simple recommendations
      return await this.fallbackService.getBasicRecommendations(userId)
    }
  }
}
```

---

## 📚 DOCUMENTATION PATTERNS

### **API Documentation**
```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securePassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
export async function createUser(req: Request, res: Response) {
  // Implementation
}
```

---

## 🎯 LESSONS LEARNED

### **Common Pitfalls**
1. **Over-engineering**: Start simple, add complexity when needed
2. **Premature optimization**: Profile before optimizing
3. **Insufficient error handling**: Plan for failure scenarios
4. **Poor testing strategy**: Test the right things at the right level
5. **Ignoring security**: Security should be built-in, not bolted-on

### **Success Factors**
1. **Clear architecture**: Well-defined boundaries and responsibilities
2. **Comprehensive testing**: Unit, integration, and e2e tests
3. **Monitoring and observability**: Know what's happening in production
4. **Documentation**: Keep it current and useful
5. **Team collaboration**: Regular communication and knowledge sharing

---

*Last Updated: 2025-07-14*
*Version: 1.0*
*Contributors: Multi-Agent Development Team*
