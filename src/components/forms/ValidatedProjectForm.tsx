'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateProjectSchema, ProjectTypeSchema, validateSafe, z } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

const ExtendedProjectSchema = CreateProjectSchema.extend({
  config: z.object({
    database: z.string().optional(),
    hosting: z.string().optional(),
    authentication: z.string().optional(),
    api_style: z.string().optional()
  }).optional()
});

// Type-safe form data
type CreateProjectForm = z.infer<typeof ExtendedProjectSchema>

export function ValidatedProjectForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateProjectForm>({
    name: '',
    description: '',
    type: 'web-app',
    status: 'planning',
    config: {
      features: []
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError(null)

    // Validate form data
    const validation = validateSafe(ExtendedProjectSchema, formData)
    
    if (!validation.success) {
      // Map validation errors to form fields
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.errors.forEach(err => {
        const field = err.path.join('.')
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create project')
      }

      const project = await response.json()
      router.push(`/projects/${project.id}`)
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof CreateProjectForm>(
    field: K,
    value: CreateProjectForm[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const updateConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Fill in the details to create a new project with validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="My Awesome Project"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Project Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateField('type', value as any)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ProjectTypeSchema.options.map((type: any) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework">Framework (Optional)</Label>
              <Select
                value={formData.config.framework || ''}
                onValueChange={(value) => updateConfig('framework', value)}
              >
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="fastapi">FastAPI</SelectItem>
                  <SelectItem value="django">Django</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language (Optional)</Label>
              <Select
                value={formData.config.language || ''}
                onValueChange={(value) => updateConfig('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Database (Optional)</Label>
              <Select
                value={formData.config.database || ''}
                onValueChange={(value) => updateConfig('database', value)}
              >
                <SelectTrigger id="database">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="firebase">Firebase</SelectItem>
                  <SelectItem value="dynamodb">DynamoDB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Authentication',
                'Database',
                'API',
                'Real-time',
                'File Upload',
                'Payment',
                'Email',
                'Analytics'
              ].map((feature: any) => (
                <label key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.config.features?.includes(feature) || false}
                    onChange={(e) => {
                      const features = formData.config.features || []
                      if (e.target.checked) {
                        updateConfig('features', [...features, feature])
                      } else {
                        updateConfig('features', features.filter((f: any) => f !== feature))
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

/**
 * Example of a custom hook for form validation
 */
export function useValidatedForm<T>(schema: z.ZodSchema<T>, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => new Set(prev).add(String(field)))
    
    // Validate single field
    const fieldSchema = (schema as any).shape[field as string]
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value)
      if (!result.success) {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message
        }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[String(field)]
          return newErrors
        })
      }
    }
  }

  const validate = () => {
    const result = schema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        const field = err.path.join('.')
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const reset = () => {
    setData(initialData)
    setErrors({})
    setTouched(new Set())
  }

  return {
    data,
    errors,
    touched,
    updateField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}