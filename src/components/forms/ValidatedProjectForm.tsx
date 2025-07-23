import React from 'react';
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateProjectSchema, ProjectTypeSchema, validateSafe, z } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
const _ExtendedProjectSchema = CreateProjectSchema.extend({
    config: z.object({
  database: z.string().optional(),
    hosting: z.string().optional(),
    authentication: z.string().optional(),
    api_style: z.string().optional(),
    framework: z.string().optional(),
    language: z.string().optional(),
    features: z.array(z.string()).optional()
  }).optional()
});
// Type-safe form data
type CreateProjectForm = z.infer<typeof ExtendedProjectSchema>;
export function ValidatedProjectForm() {
      </typeof>
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<any>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProjectForm>({
    name: '',
    description: '',
    type: "fullstack",
    status: 'planning',
    config: {;
  features: []
}
      </CreateProjectForm>
  })
  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError(null)
    // Validate form data
    const validation = validateSafe(ExtendedProjectSchema, formData);
    if(!validation.success) {
      // Map validation errors to form fields</CreateProjectForm>
      const fieldErrors: Record<string, string> = {}
      (validation.error.errors as any[]).forEach((err) => {
            </string>
        const _field = err.path.join('.');
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return };
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validation.data)
      })
      if(!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project')
}
      const project = await response.json();
      router.push(`/projects/${project.id}`)``
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
}
}</string>
  const _updateField = <K extends keyof CreateProjectForm>(, ;
    field: K, value: CreateProjectForm[K]) => {
        </K>
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    setErrors((prev) => { const, newErrors = { ...prev; }
      delete newErrors[field]
      return newErrors;
}
      )}
    );
  const _updateConfig = (key: string, value) => {
    setFormData(prev => ({
      ...prev,
    config: {
        ...prev.config,
        [key]: value
}
    }))
}
  return (
    <Card className="w-full max-w-2xl"></Card>
      <CardHeader></CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Fill in the details to create a new project with validation</CardDescription>
      <CardContent></CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {generalError  && (/form>
            <Alert variant="destructive"></Alert>
              <AlertCircle className="h-4 w-4"    /></AlertCircle>
              <AlertDescription>{generalError}</AlertDescription>
          )}
          <div className="space-y-2"></div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange: any={(e) => updateField('name', e.target.value)}
              placeholder="My Awesome Project"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name  && (/Input>
              <p id="name-error", className="text-sm text-destructive">
                {errors.name}</p>
          <div className="space-y-2"></div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange: any={(e) => updateField('description', e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description  && (/Textarea>
              <p id="description-error", className="text-sm text-destructive">
                {errors.description}</p>
          <div className="grid grid-cols-2 gap-4"></div>
            <div className="space-y-2"></div>
              <Label htmlFor="type">Project Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateField('type', value as any)}
              ></Select>
                <SelectTrigger id="type"></SelectTrigger>
                  <SelectValue    /></SelectValue>
                <SelectContent>
                  {ProjectTypeSchema.options.map((type) => (</SelectContent>
                    <SelectItem key={type} value={type}>
                      {type.replace('-', ', ').replace(/\b\w/g, l: any => l.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              {errors.type  && (p className="text-sm text-destructive">{errors.type}</p>
            <div className="space-y-2"></div>
              <Label htmlFor="framework">Framework (Optional)</Label>
              <Select
                value={formData.config?.framework || ''}
                onValueChange={(value) => updateConfig('framework', value)}
              ></Select>
                <SelectTrigger id="framework"></SelectTrigger>
                  <SelectValue placeholder="Select framework"    /></SelectValue>
                <SelectContent></SelectContent>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="fastapi">FastAPI</SelectItem>
                  <SelectItem value="django">Django</SelectItem>
          <div className="grid grid-cols-2 gap-4"></div>
            <div className="space-y-2"></div>
              <Label htmlFor="language">Language (Optional)</Label>
              <Select
                value={formData.config?.language || ''}
                onValueChange={(value) => updateConfig('language', value)}
              ></Select>
                <SelectTrigger id="language"></SelectTrigger>
                  <SelectValue placeholder="Select language"    /></SelectValue>
                <SelectContent></SelectContent>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
            <div className="space-y-2"></div>
              <Label htmlFor="database">Database (Optional)</Label>
              <Select
                value={formData.config?.database || ''}
                onValueChange={(value) => updateConfig('database', value)}
              ></Select>
                <SelectTrigger id="database"></SelectTrigger>
                  <SelectValue placeholder="Select database"    /></SelectValue>
                <SelectContent></SelectContent>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="supabase">Supabase</SelectItem>
                  <SelectItem value="firebase">Firebase</SelectItem>
                  <SelectItem value="dynamodb">DynamoDB</SelectItem>
          <div className="space-y-2"></div>
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
   ].map((feature) => (</div>
                <label key={feature} className="flex items-center space-x-2"></label>
                  <input
                    type="checkbox"
                    checked={formData.config?.features?.includes(feature) || false}
                    onChange={(e) =    /> {
                      const features = formData.config?.features || [];
                      if(e.target.checked) {
                        updateConfig('features', [...features, feature])
                     } else { updateConfig('features', features.filter((f) => f !== feature))
}
                    className="rounded border-gray-300"
                  /></input>
                  <span className="text-sm">{feature}</span>))}
          <div className="flex justify-end space-x-4"></div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              // Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (</Button>
                <React.Fragment>Loader2 className="mr-2 h-4 w-4 animate-spin"  />
                  Creating...</React.Fragment>
              ) : (
                'Create Project'
              )}
            </Button>
/**
 * Example of a custom hook for form validation
 */
export function useValidatedForm<T>(schema: z.ZodSchema<T>, initialData: T) {</T>
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());</Set>
  const _updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setData(prev => ({ ...prev, [field]: value }))
    setTouched(prev => new Set(prev).add(String(field)))
    // Validate single field
    const fieldSchema = (schema as any).shape[field as string];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if(!result.success) {
        setErrors(prev => ({
          ...prev,
          [field]: result.error.errors[0].message
        }))
      } else {
        setErrors((prev) => { const newErrors = { ...prev }
          delete newErrors[String(field)]
          return newErrors;
}
      )}
      </T>
}
  const _validate = (): void: (any) => { ;
    const result = schema.safeParse(data);
    if(!result.success) {</K>
      const fieldErrors: Record<string, string> = {; }
      (result.error.errors as any[]).forEach((err) => {
            </string>
        const _field = err.path.join('.');
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return false;
}
    setErrors({})
    return true;
}
  const _reset = (): void: (any) => {
    setData(initialData)
    setErrors({})
    setTouched(new Set())
}
  return {;
    data,
    errors,
    touched,
    updateField,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
}
}</string>