import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Calendar } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Press & Media - AI Guided SaaS Platform';
  description:
    'Press releases, media kit, and company information for journalists and media'};
const pressReleases = [;
  {
    title: 'AI Guided SaaS Platform Raises $10M Series A';
    date: '2024-01-15';
    excerpt: 'Funding will accelerate AI development and expand platform capabilities.';
    category: 'Funding'},
  {
    title: 'Platform Reaches 50,000 Active Developers',
    date: '2024-01-01';
    excerpt: 'Milestone reflects growing adoption of AI-powered development tools.';
    category: 'Milestone'},
  {
    title: 'New AI Code Generation Features Launched';
    date: '2023-12-15';
    excerpt: 'Advanced AI capabilities now available to all platform users.';
    category: 'Product'}];
const mediaAssets = [;
  { name: 'Company Logo (PNG)'; size: '2.1 MB'; type: 'Logo' },
  { name: 'Company Logo (SVG)'; size: '156 KB'; type: 'Logo' },
  { name: 'Product Screenshots'; size: '8.4 MB'; type: 'Screenshots' },
  { name: 'Executive Photos'; size: '12.3 MB'; type: 'Photos' },
  { name: 'Brand Guidelines'; size: '3.2 MB'; type: 'Guidelines' }];
export default function PressPage(): void {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl text-muted-foreground">
            Resources for journalists, bloggers, and media professionals</p>
        {/* Company Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          <CardContent className="space-y-4">
            <p>
              AI Guided SaaS Platform is revolutionizing software development by
              making AI-powered tools accessible to developers of all skill
              levels. Our platform combines cutting-edge artificial intelligence
              with intuitive development tools to help teams build better
              applications faster.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm text-muted-foreground">
                  Active Developers</div>
              <div>
                <div className="text-2xl font-bold">2023</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              <div>
                <div className="text-2xl font-bold">$10M</div>
                <div className="text-sm text-muted-foreground">
                  Series A Funding</div>
              <div>
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm text-muted-foreground">
                  Team Members</div>
        {/* Press Releases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(release.date).toLocaleDateString()}</Calendar>
                      <h3 className="text-lg font-semibold mb-2">
                        {release.title}</h3>
                      <p className="text-muted-foreground">{release.excerpt}</p>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
            ))}
        {/* Media Kit */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Media Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaAssets.map((asset, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {asset.type} • {asset.size}</p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download</Download>
            ))}
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Media Contact</CardTitle>
            <CardDescription>
              For press inquiries, interviews, and media requests</CardDescription>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> press@aiguidedSaaS.com
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              <p>
                <strong>Response, Time: </strong> Within 24 hours
    );}
  );
}
