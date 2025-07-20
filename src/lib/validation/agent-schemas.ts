import { z } from 'zod'

// BMAD Agent Schemas

// Analyst Agent schemas
export const RequirementAnalysisSchema = z.object({
  functionalRequirements: z.array(z.string()),
  nonFunctionalRequirements: z.array(z.string()),
  constraints: z.array(z.string()),
  assumptions: z.array(z.string()),
  risks: z.array(z.string()),
  successCriteria: z.array(z.string()),
  userStories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    asA: z.string(),
    iWant: z.string(),
    soThat: z.string(),
    acceptanceCriteria: z.array(z.string()),
    priority: z.enum(['high', 'medium', 'low']),
    estimatedEffort: z.enum(['small', 'medium', 'large'])
  })),
  technicalConsiderations: z.array(z.string())
})

// Project Manager Agent schemas
export const TimelineSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  totalDuration: z.string(),
  phases: z.array(z.object({
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    deliverables: z.array(z.string()),
    dependencies: z.array(z.string())
  }))
})

export const MilestoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  criteria: z.array(z.string()),
  deliverables: z.array(z.string())
})

export const WorkPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  assignedTo: z.array(z.string()),
  estimatedHours: z.number(),
  dependencies: z.array(z.string()),
  deliverables: z.array(z.string()),
  priority: z.enum(['critical', 'high', 'medium', 'low'])
})

export const ProjectPlanSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string(),
  timeline: TimelineSchema,
  milestones: z.array(MilestoneSchema),
  workBreakdown: z.array(WorkPackageSchema),
  resourceAllocation: z.object({
    teamStructure: z.array(z.object({
      role: z.string(),
      responsibilities: z.array(z.string()),
      skillsNeeded: z.array(z.string()),
      allocation: z.number()
    })),
    skillsRequired: z.array(z.string()),
    toolsRequired: z.array(z.string()),
    externalDependencies: z.array(z.string())
  }),
  riskMitigation: z.array(z.object({
    risk: z.string(),
    probability: z.enum(['high', 'medium', 'low']),
    impact: z.enum(['high', 'medium', 'low']),
    mitigationStrategy: z.string(),
    contingencyPlan: z.string(),
    owner: z.string()
  })),
  communicationPlan: z.object({
    stakeholders: z.array(z.object({
      name: z.string(),
      role: z.string(),
      interest: z.enum(['high', 'medium', 'low']),
      influence: z.enum(['high', 'medium', 'low']),
      communicationNeeds: z.array(z.string())
    })),
    meetings: z.array(z.object({
      type: z.string(),
      frequency: z.string(),
      participants: z.array(z.string()),
      purpose: z.string()
    })),
    reportingSchedule: z.string(),
    escalationPath: z.array(z.string())
  }),
  qualityAssurance: z.object({
    standards: z.array(z.string()),
    reviewProcess: z.array(z.string()),
    testingStrategy: z.array(z.string()),
    acceptanceCriteria: z.array(z.string()),
    metrics: z.array(z.string())
  })
})

// Architect Agent schemas
export const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['frontend', 'backend', 'service', 'database', 'external']),
  responsibility: z.string(),
  technology: z.array(z.string()),
  interfaces: z.array(z.object({
    name: z.string(),
    type: z.enum(['REST', 'GraphQL', 'WebSocket', 'gRPC', 'Event']),
    description: z.string(),
    methods: z.array(z.object({
      name: z.string(),
      httpMethod: z.string().optional(),
      path: z.string().optional(),
      input: z.string(),
      output: z.string(),
      description: z.string()
    }))
  })),
  dependencies: z.array(z.string()),
  scalability: z.string()
})

export const SystemArchitectureSchema = z.object({
  overview: z.object({
    style: z.string(),
    principles: z.array(z.string()),
    constraints: z.array(z.string()),
    qualityAttributes: z.array(z.object({
      name: z.string(),
      requirement: z.string(),
      approach: z.string(),
      tradeoffs: z.array(z.string())
    })),
    diagram: z.string()
  }),
  components: z.array(ComponentSchema),
  dataModel: z.object({
    entities: z.array(z.object({
      name: z.string(),
      description: z.string(),
      attributes: z.array(z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        unique: z.boolean().optional(),
        indexed: z.boolean().optional(),
        description: z.string()
      })),
      businessRules: z.array(z.string())
    })),
    relationships: z.array(z.object({
      from: z.string(),
      to: z.string(),
      type: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
      description: z.string()
    })),
    dataFlow: z.array(z.object({
      name: z.string(),
      source: z.string(),
      destination: z.string(),
      dataType: z.string(),
      frequency: z.string(),
      volume: z.string()
    })),
    storageStrategy: z.object({
      databases: z.array(z.object({
        name: z.string(),
        type: z.enum(['relational', 'document', 'key-value', 'graph', 'time-series']),
        technology: z.string(),
        purpose: z.string(),
        entities: z.array(z.string())
      })),
      caching: z.object({
        levels: z.array(z.string()),
        technologies: z.array(z.string()),
        ttl: z.record(z.number())
      }),
      fileStorage: z.object({
        type: z.string(),
        provider: z.string(),
        structure: z.string()
      })
    })
  }),
  apiDesign: z.object({
    style: z.enum(['REST', 'GraphQL', 'gRPC', 'Mixed']),
    versioning: z.string(),
    authentication: z.string(),
    authorization: z.string(),
    rateLimiting: z.string(),
    documentation: z.string(),
    endpoints: z.array(z.object({
      path: z.string(),
      method: z.string(),
      description: z.string(),
      authentication: z.boolean(),
      requestSchema: z.any(),
      responseSchema: z.any(),
      errorHandling: z.array(z.string())
    }))
  }),
  infrastructure: z.object({
    hostingPlatform: z.string(),
    computeResources: z.array(z.object({
      name: z.string(),
      type: z.string(),
      specifications: z.record(z.any()),
      scalingPolicy: z.string(),
      estimatedCost: z.string()
    })),
    networking: z.object({
      vpc: z.boolean(),
      subnets: z.array(z.string()),
      loadBalancer: z.string(),
      cdn: z.string(),
      dns: z.string()
    }),
    monitoring: z.object({
      tools: z.array(z.string()),
      metrics: z.array(z.string()),
      alerts: z.array(z.object({
        name: z.string(),
        condition: z.string(),
        severity: z.enum(['critical', 'warning', 'info']),
        action: z.string()
      })),
      dashboards: z.array(z.string())
    }),
    backup: z.object({
      frequency: z.string(),
      retention: z.string(),
      type: z.string(),
      location: z.string()
    })
  }),
  security: z.object({
    principles: z.array(z.string()),
    threats: z.array(z.object({
      threat: z.string(),
      category: z.string(),
      likelihood: z.enum(['high', 'medium', 'low']),
      impact: z.enum(['high', 'medium', 'low']),
      mitigation: z.array(z.string())
    })),
    controls: z.array(z.object({
      name: z.string(),
      type: z.string(),
      implementation: z.string(),
      scope: z.array(z.string())
    })),
    compliance: z.array(z.string()),
    dataProtection: z.object({
      encryption: z.object({
        atRest: z.string(),
        inTransit: z.string(),
        keyManagement: z.string()
      }),
      privacy: z.array(z.object({
        name: z.string(),
        description: z.string(),
        implementation: z.string()
      })),
      accessControl: z.object({
        type: z.string(),
        implementation: z.string(),
        roles: z.array(z.string())
      })
    })
  }),
  integrations: z.array(z.object({
    name: z.string(),
    type: z.enum(['API', 'Webhook', 'SDK', 'Database', 'Message Queue']),
    purpose: z.string(),
    protocol: z.string(),
    authentication: z.string(),
    dataFormat: z.string(),
    errorHandling: z.string()
  })),
  deploymentStrategy: z.object({
    approach: z.string(),
    environments: z.array(z.object({
      name: z.string(),
      purpose: z.string(),
      configuration: z.record(z.any()),
      resources: z.array(z.string())
    })),
    pipeline: z.array(z.object({
      name: z.string(),
      actions: z.array(z.string()),
      triggers: z.array(z.string()),
      approvals: z.array(z.string())
    })),
    rollbackStrategy: z.string(),
    blueGreenDeployment: z.boolean()
  }),
  technicalDecisions: z.array(z.object({
    decision: z.string(),
    rationale: z.string(),
    alternatives: z.array(z.string()),
    tradeoffs: z.array(z.string()),
    risks: z.array(z.string())
  })),
  architecturalPatterns: z.array(z.string())
})

// Archon Agent Schemas

// Prompt Refiner schemas
export const RefinedPromptSchema = z.object({
  originalPrompt: z.string(),
  refinedPrompt: z.string(),
  improvements: z.array(z.object({
    type: z.enum(['clarity', 'specificity', 'context', 'structure', 'examples']),
    original: z.string(),
    improved: z.string(),
    rationale: z.string()
  })),
  clarity: z.object({
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    suggestions: z.array(z.string())
  }),
  examples: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
    explanation: z.string()
  })),
  constraints: z.array(z.string()),
  expectedOutput: z.object({
    format: z.string(),
    structure: z.any(),
    constraints: z.array(z.string()),
    validationRules: z.array(z.string())
  }),
  confidence: z.number().min(0).max(1)
})

// Tools Refiner schemas
export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  capabilities: z.array(z.string()),
  limitations: z.array(z.string()),
  dependencies: z.array(z.string()),
  cost: z.object({
    type: z.enum(['free', 'freemium', 'paid', 'usage-based']),
    estimatedMonthly: z.number(),
    scalingFactors: z.array(z.string())
  }),
  performance: z.object({
    speed: z.enum(['fast', 'moderate', 'slow']),
    reliability: z.number().min(0).max(100),
    scalability: z.enum(['high', 'medium', 'low']),
    resourceUsage: z.object({
      cpu: z.enum(['low', 'medium', 'high']),
      memory: z.enum(['low', 'medium', 'high']),
      network: z.enum(['low', 'medium', 'high'])
    })
  })
})

export const ToolRefinementSchema = z.object({
  originalTools: z.array(ToolSchema),
  refinedTools: z.array(ToolSchema),
  additions: z.array(z.object({
    tool: ToolSchema,
    rationale: z.string(),
    alternatives: z.array(z.string()),
    integrationPlan: z.string()
  })),
  modifications: z.array(z.object({
    toolId: z.string(),
    originalConfig: z.any(),
    newConfig: z.any(),
    changes: z.array(z.string()),
    rationale: z.string()
  })),
  removals: z.array(z.object({
    toolId: z.string(),
    toolName: z.string(),
    rationale: z.string(),
    replacement: z.string().optional()
  })),
  integrations: z.array(z.object({
    tools: z.array(z.string()),
    integrationType: z.enum(['sequential', 'parallel', 'conditional', 'fallback']),
    description: z.string(),
    dataFlow: z.string(),
    benefits: z.array(z.string())
  })),
  performance: z.object({
    overallEfficiency: z.number().min(0).max(100),
    bottlenecks: z.array(z.string()),
    optimizations: z.array(z.string()),
    costEffectiveness: z.number().min(0).max(100)
  }),
  recommendations: z.array(z.string())
})

// Agent Refiner schemas
export const AgentConfigurationSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  capabilities: z.array(z.string()),
  tools: z.array(z.string()),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  systemPrompt: z.string().optional()
})

export const RefinedAgentSchema = AgentConfigurationSchema.extend({
  refinements: z.array(z.object({
    type: z.enum(['capability', 'prompt', 'tool', 'parameter', 'collaboration']),
    original: z.string(),
    refined: z.string(),
    rationale: z.string(),
    impact: z.enum(['high', 'medium', 'low'])
  })),
  collaborationRoles: z.array(z.object({
    withAgent: z.string(),
    interactionType: z.enum(['provider', 'consumer', 'peer']),
    dataExchange: z.array(z.string()),
    protocol: z.string()
  })),
  performanceProfile: z.object({
    speed: z.enum(['fast', 'moderate', 'slow']),
    accuracy: z.number().min(0).max(100),
    resourceUsage: z.enum(['low', 'medium', 'high']),
    specialtyAreas: z.array(z.string()),
    weaknesses: z.array(z.string())
  }),
  specializations: z.array(z.string())
})

export const AgentRefinementSchema = z.object({
  originalAgents: z.array(AgentConfigurationSchema),
  refinedAgents: z.array(RefinedAgentSchema),
  improvements: z.array(z.object({
    agentId: z.string(),
    improvementType: z.string(),
    description: z.string(),
    implementation: z.string(),
    expectedBenefit: z.string()
  })),
  collaborationStrategy: z.object({
    orchestration: z.object({
      type: z.enum(['hierarchical', 'peer-to-peer', 'hub-spoke', 'pipeline']),
      coordinator: z.string().optional(),
      description: z.string(),
      benefits: z.array(z.string())
    }),
    communicationFlow: z.array(z.object({
      from: z.string(),
      to: z.string(),
      dataType: z.string(),
      frequency: z.enum(['continuous', 'on-demand', 'scheduled']),
      protocol: z.string()
    })),
    sharedResources: z.array(z.object({
      name: z.string(),
      type: z.enum(['memory', 'artifact', 'model', 'tool']),
      accessPattern: z.enum(['read-only', 'read-write', 'exclusive']),
      owners: z.array(z.string())
    })),
    conflictResolution: z.object({
      strategy: z.string(),
      priorityRules: z.array(z.string()),
      escalationPath: z.array(z.string())
    })
  }),
  performanceMetrics: z.object({
    overallEfficiency: z.number().min(0).max(100),
    collaborationScore: z.number().min(0).max(100),
    redundancyReduction: z.number(),
    specialization: z.number().min(0).max(100),
    scalability: z.string()
  }),
  recommendations: z.array(z.string())
})

// Advisor Agent schemas
export const AdvisoryReportSchema = z.object({
  situation: z.object({
    summary: z.string(),
    context: z.array(z.string()),
    stakeholders: z.array(z.object({
      name: z.string(),
      role: z.string(),
      interests: z.array(z.string()),
      influence: z.enum(['high', 'medium', 'low']),
      impact: z.enum(['high', 'medium', 'low'])
    })),
    constraints: z.array(z.string()),
    opportunities: z.array(z.string()),
    challenges: z.array(z.string())
  }),
  recommendations: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    rationale: z.string(),
    prerequisites: z.array(z.string()),
    expectedOutcome: z.string(),
    timeframe: z.string(),
    resources: z.array(z.object({
      type: z.enum(['human', 'technical', 'financial', 'time']),
      description: z.string(),
      quantity: z.string(),
      availability: z.enum(['immediate', 'short-term', 'long-term'])
    }))
  })),
  strategies: z.array(z.object({
    name: z.string(),
    approach: z.string(),
    phases: z.array(z.object({
      name: z.string(),
      duration: z.string(),
      activities: z.array(z.string()),
      deliverables: z.array(z.string()),
      milestones: z.array(z.string())
    })),
    successCriteria: z.array(z.string()),
    keyPerformanceIndicators: z.array(z.object({
      name: z.string(),
      description: z.string(),
      target: z.string(),
      measurement: z.string(),
      frequency: z.string()
    })),
    dependencies: z.array(z.string())
  })),
  risks: z.array(z.object({
    risk: z.string(),
    category: z.enum(['technical', 'business', 'operational', 'strategic']),
    likelihood: z.number().min(1).max(5),
    impact: z.number().min(1).max(5),
    riskScore: z.number(),
    mitigation: z.array(z.string()),
    monitoring: z.string(),
    owner: z.string()
  })),
  alternatives: z.array(z.object({
    name: z.string(),
    description: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    feasibility: z.enum(['high', 'medium', 'low']),
    cost: z.enum(['high', 'medium', 'low']),
    timeToImplement: z.string(),
    recommendation: z.string()
  })),
  decisionMatrix: z.object({
    criteria: z.array(z.object({
      name: z.string(),
      weight: z.number().min(0).max(1),
      description: z.string()
    })),
    options: z.array(z.object({
      name: z.string(),
      description: z.string()
    })),
    scores: z.array(z.array(z.object({
      value: z.number().min(1).max(10),
      rationale: z.string()
    }))),
    weightedScores: z.array(z.number()),
    recommendation: z.string()
  }),
  actionPlan: z.object({
    immediateActions: z.array(z.object({
      id: z.string(),
      task: z.string(),
      responsible: z.string(),
      deadline: z.string(),
      dependencies: z.array(z.string()),
      expectedResult: z.string(),
      verificationMethod: z.string()
    })),
    shortTermActions: z.array(z.object({
      id: z.string(),
      task: z.string(),
      responsible: z.string(),
      deadline: z.string(),
      dependencies: z.array(z.string()),
      expectedResult: z.string(),
      verificationMethod: z.string()
    })),
    longTermActions: z.array(z.object({
      id: z.string(),
      task: z.string(),
      responsible: z.string(),
      deadline: z.string(),
      dependencies: z.array(z.string()),
      expectedResult: z.string(),
      verificationMethod: z.string()
    })),
    contingencyPlans: z.array(z.object({
      trigger: z.string(),
      plan: z.string(),
      actions: z.array(z.string()),
      escalation: z.string()
    })),
    successMetrics: z.array(z.string()),
    reviewSchedule: z.string()
  }),
  confidence: z.number().min(0).max(1)
})

// Runtime schemas
export const ExecutionPlanSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    agentType: z.string(),
    input: z.string(),
    priority: z.enum(['critical', 'high', 'medium', 'low']),
    dependencies: z.array(z.string()).optional(),
    timeout: z.number().optional(),
    retries: z.number().optional(),
    metadata: z.record(z.unknown()).optional()
  })),
  dependencies: z.map(z.string(), z.array(z.string())),
  executionOrder: z.array(z.array(z.string())),
  estimatedDuration: z.number()
})

export const TaskResultSchema = z.object({
  taskId: z.string(),
  agentType: z.string(),
  result: z.object({
    success: z.boolean(),
    output: z.any(),
    messages: z.array(z.object({
      type: z.enum(['thought', 'observation', 'action']),
      content: z.string(),
      timestamp: z.number(),
      data: z.any().optional()
    })),
    artifacts: z.map(z.string(), z.any()).optional(),
    error: z.string().optional(),
    nextSteps: z.array(z.string()).optional(),
    confidence: z.number().min(0).max(1).optional()
  }),
  startTime: z.number(),
  endTime: z.number(),
  duration: z.number(),
  retryCount: z.number(),
  error: z.instanceof(Error).optional()
})

// Type exports
export type RequirementAnalysis = z.infer<typeof RequirementAnalysisSchema>
export type ProjectPlan = z.infer<typeof ProjectPlanSchema>
export type SystemArchitecture = z.infer<typeof SystemArchitectureSchema>
export type RefinedPrompt = z.infer<typeof RefinedPromptSchema>
export type ToolRefinement = z.infer<typeof ToolRefinementSchema>
export type AgentRefinement = z.infer<typeof AgentRefinementSchema>
export type AdvisoryReport = z.infer<typeof AdvisoryReportSchema>
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>
export type TaskResult = z.infer<typeof TaskResultSchema>