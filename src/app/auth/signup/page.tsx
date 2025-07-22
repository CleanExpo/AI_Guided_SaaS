import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up - AI Guided SaaS Platform',
  description: 'Create your account to get started with AI-powered development'};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Get started with AI Guided SaaS Platform</CardDescription>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub</Github>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Google</Mail>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with</span>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Create Account</Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{' '}</span>
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in</Link>

          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}</div>
            <Link href="/terms" className="hover:underline">
              Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy</Link>
    );
}

    </form>
    </div>
    </Button>
    </div>
    </CardContent>
    </CardHeader>
    </Card>
    </div>
  );
</form>
</div>
</div>
</Button>
</Button>
</div>
</CardContent>
</CardHeader>
</Card>
</div>
}