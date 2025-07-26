export interface SystemArchitecture {
  overview: ArchitectureOverview;
  components: Component[];
  dataModel: DataModel;
  apiDesign: APIDesign;
  infrastructure: Infrastructure;
  security: SecurityArchitecture;
  integrations: Integration[];
  deploymentStrategy: DeploymentStrategy;
  technicalDecisions: TechnicalDecision[];
  architecturalPatterns: string[];
}

export interface ArchitectureOverview {
  style: string; // e.g., 'microservices', 'monolithic', 'serverless'
  principles: string[];
  constraints: string[];
  qualityAttributes: QualityAttribute[];
  diagram: string; // ASCII or description for now
}

export interface QualityAttribute {
  name: string;
  requirement: string;
  approach: string;
  tradeoffs: string[];
}

export interface Component {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'service' | 'database' | 'external';
  responsibility: string;
  technology: string[];
  interfaces: ComponentInterface[];
  dependencies: string[];
  scalability: string;
}

export interface ComponentInterface {
  name: string;
  type: 'REST' | 'GraphQL' | 'WebSocket' | 'gRPC' | 'Event';
  description: string;
  methods: InterfaceMethod[];
}

export interface InterfaceMethod {
  name: string;
  httpMethod?: string;
  path?: string;
  input: string;
  output: string;
  description: string;
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
  dataFlow: DataFlow[];
  storageStrategy: StorageStrategy;
}

export interface Entity {
  name: string;
  description: string;
  attributes: Attribute[];
  businessRules: string[];
}

export interface Attribute {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  indexed?: boolean;
  description: string;
}

export interface Relationship {
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description: string;
}

export interface DataFlow {
  name: string;
  source: string;
  destination: string;
  dataType: string;
  frequency: string;
  volume: string;
}

export interface StorageStrategy {
  databases: Database[];
  caching: CachingStrategy;
  fileStorage: FileStorageStrategy;
}

export interface Database {
  type: string;
  purpose: string;
  entities: string[];
  scalingStrategy: string;
}

export interface CachingStrategy {
  type: string;
  layers: string[];
  ttl: Record<string, number>;
}

export interface FileStorageStrategy {
  type: string;
  purpose: string[];
  structure: string;
}

export interface APIDesign {
  style: string;
  versioning: string;
  authentication: string;
  authorization: string;
  rateLimiting: RateLimiting;
  endpoints: APIEndpoint[];
  documentation: string;
}

export interface RateLimiting {
  strategy: string;
  limits: Record<string, number>;
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  authentication: boolean;
  rateLimit?: string;
  request: string;
  response: string;
  errors: string[];
}

export interface Infrastructure {
  cloudProvider: string;
  services: CloudService[];
  networking: NetworkingConfig;
  monitoring: MonitoringConfig;
  backup: BackupStrategy;
}

export interface CloudService {
  name: string;
  type: string;
  purpose: string;
  configuration: Record<string, any>;
}

export interface NetworkingConfig {
  vpc: boolean;
  subnets: string[];
  loadBalancer: string;
  cdn: boolean;
  dns: string;
}

export interface MonitoringConfig {
  apm: string;
  logging: string;
  metrics: string;
  alerting: string[];
}

export interface BackupStrategy {
  frequency: string;
  retention: string;
  type: string;
  locations: string[];
}

export interface SecurityArchitecture {
  authenticationMethod: string;
  authorizationModel: string;
  dataEncryption: EncryptionStrategy;
  secretsManagement: string;
  compliance: string[];
  securityHeaders: Record<string, string>;
  vulnerabilityScanning: string;
}

export interface EncryptionStrategy {
  inTransit: string;
  atRest: string;
  keyManagement: string;
}

export interface Integration {
  name: string;
  type: string;
  purpose: string;
  authentication: string;
  dataFlow: string;
  errorHandling: string;
}

export interface DeploymentStrategy {
  type: string;
  environments: Environment[];
  cicd: CICDPipeline;
  rollbackStrategy: string;
  blueGreenDeployment: boolean;
  canaryDeployment: boolean;
}

export interface Environment {
  name: string;
  purpose: string;
  configuration: Record<string, any>;
  scaling: string;
}

export interface CICDPipeline {
  provider: string;
  stages: string[];
  testing: string[];
  qualityGates: string[];
}

export interface TechnicalDecision {
  area: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  tradeoffs: string[];
}