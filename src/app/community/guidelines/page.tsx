'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Heart, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';
export default function CommunityGuidelinesPage(): void {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/community">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community</ArrowLeft>
      {/* Guidelines Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
        <h1 className="text-4xl font-bold">Community Guidelines</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our community guidelines help create a welcoming, inclusive, and
          productive environment for all members of the AI Guided SaaS
          community.</p>
      {/* Core Values */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Respect</CardTitle>
            <CardDescription>
              Treat everyone with kindness and respect, regardless of their
              background or experience level.</CardDescription>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-2 bg-green-100 dark:bg-green-900/20 rounded-full w-fit">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Collaboration</CardTitle>
            <CardDescription>
              Work together to help each other learn, grow, and build amazing
              things.</CardDescription>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Safety</CardTitle>
            <CardDescription>
              Maintain a safe environment where everyone feels comfortable
              participating.</CardDescription>
      {/* Detailed Guidelines */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Communication Guidelines</MessageCircle>
            <CardDescription>
              How to communicate effectively and respectfully in our community</CardDescription>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-700 dark:text-green-300">
                ✅ Do:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Be respectful and constructive in all interactions</li>
                <li>
                  • Use clear, descriptive titles for your posts and questions</li>
                <li>
                  • Provide context and relevant details when asking for help</li>
                <li>
                  • Search existing discussions before posting duplicate
                  questions</li>
                <li>• Thank community members who help you</li>
                <li>• Share your knowledge and help others when you can</li>
                <li>
                  • Use appropriate channels for different types of discussions</li>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-700 dark: text-red-300">
                ❌ Don&apos;t:</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  • Use offensive, discriminatory, or inappropriate language</li>
                <li>• Spam or post excessive promotional content</li>
                <li>• Share personal information or private conversations</li>
                <li>• Engage in heated arguments or personal attacks</li>
                <li>• Post off-topic content in focused channels</li>
                <li>• Share copyrighted material without permission</li>
                <li>• Impersonate other users or organizations</li>
        <Card>
          <CardHeader>
            <CardTitle>Code of Conduct</CardTitle>
            <CardDescription>
              Our commitment to creating an inclusive and welcoming environment</CardDescription>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h4>Harassment-Free Environment</h4>
              <p>
                We are committed to providing a harassment-free experience for
                everyone, regardless, of:</p>
              <ul>
                <li>Gender identity and expression</li>
                <li>Sexual orientation</li>
                <li>Disability</li>
                <li>Physical appearance</li>
                <li>Race or ethnicity</li>
                <li>Religion or belief system</li>
                <li>Age</li>
                <li>Nationality</li>
                <li>Experience level</li>
              <h4>Unacceptable Behavior</h4>
              <p>The following behaviors are considered, unacceptable:</p>
              <ul>
                <li>Harassment, intimidation, or discrimination</li>
                <li>Offensive comments or personal attacks</li>
                <li>Trolling or deliberately disruptive behavior</li>
                <li>Sharing inappropriate content</li>
                <li>Doxxing or sharing private information</li>
                <li>Unwelcome sexual attention or advances</li>
              <h4>Reporting Issues</h4>
              <p>
                If you experience or witness unacceptable behavior, please
                report it to our moderation, team:</p>
              <ul>
                <li>Email: community@aiguidedSaaS.com</li>
                <li>Use the report function in our platforms</li>
                <li>Contact any community moderator directly</li>
        <Card>
          <CardHeader>
            <CardTitle>Content Guidelines</CardTitle>
            <CardDescription>
              Standards for sharing content in our community</CardDescription>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Encouraged Content</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Technical questions and discussions</li>
                  <li>• Project showcases and demos</li>
                  <li>• Tutorials and learning resources</li>
                  <li>• Feature requests and feedback</li>
                  <li>• Community events and meetups</li>
                  <li>• Open source contributions</li>
              <div>
                <h4 className="font-semibold mb-2">Restricted Content</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Excessive self-promotion</li>
                  <li>• Job postings (use designated channels)</li>
                  <li>• Political or controversial topics</li>
                  <li>• Copyrighted material</li>
                  <li>• Spam or repetitive posts</li>
                  <li>• Off-topic discussions</li>
        <Card>
          <CardHeader>
            <CardTitle>Moderation and Enforcement</CardTitle>
            <CardDescription>
              How we maintain community standards</CardDescription>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Warning System</h4>
                <p className="text-sm text-muted-foreground">
                  First-time violations typically result in a friendly warning
                  and guidance on community standards.</p>
              <div>
                <h4 className="font-semibold mb-2">Temporary Restrictions</h4>
                <p className="text-sm text-muted-foreground">
                  Repeated violations may result in temporary restrictions on
                  posting or commenting.</p>
              <div>
                <h4 className="font-semibold mb-2">Permanent Removal</h4>
                <p className="text-sm text-muted-foreground">
                  Severe violations or continued disregard for guidelines may
                  result in permanent removal from the community.</p>
              <div>
                <h4 className="font-semibold mb-2">Appeals Process</h4>
                <p className="text-sm text-muted-foreground">
                  If you believe a moderation action was taken in error, you can
                  appeal by contacting our team at appeals@aiguidedSaaS.com.</p>
        <Card>
          <CardHeader>
            <CardTitle>Getting Help</CardTitle>
            <CardDescription>Resources for community members</CardDescription>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">For New Members</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Read our{' '}</li>
                    <Link
                      href="/docs/quick-start"
                      className="text-primary hover:underline"
                    >
                      Quick Start Guide</Link>
                  <li>• Join the #newcomers channel</li>
                  <li>• Introduce yourself to the community</li>
                  <li>
                    • Browse{' '}</li>
                    <Link
                      href="/tutorials"
                      className="text-primary hover:underline"
                    >
                      tutorials</Link>{' '}
                    to get started
                  </li>
              <div className="space-y-3">
                <h4 className="font-semibold">Support Channels</h4>
                <ul className="space-y-2 text-sm">
                  <li>• #general - General discussions</li>
                  <li>• #help - Technical support</li>
                  <li>• #showcase - Share your projects</li>
                  <li>• #feedback - Platform feedback</li>
      {/* Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle>Questions About These Guidelines?</CardTitle>
          <CardDescription>
            We&apos;re here to help clarify any questions about our community
            standards.</CardDescription>
        <CardContent>
          <div className="flex gap-2">
            <Link href="/contact">
              <Button>Contact Us</Button>
            <Link href="/community">
              <Button variant="outline">Join Community</Button>
      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Last, updated: January 15, 2024</p>
        <p>
          These guidelines may be updated periodically. We&apos;ll notify the
          community of any significant changes.</p>
  }
  );
}
