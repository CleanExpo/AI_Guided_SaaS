'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus,
  Trash2,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
  permissions: string[];
  status: 'active' | 'revoked' | 'expired';
  usage: number;
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_4242424242424242424242424242424242424242',
      prefix: 'sk_live_',
      createdAt: new Date('2025-01-01'),
      lastUsed: new Date('2025-01-25'),
      expiresAt: null,
      permissions: ['read', 'write', 'delete'],
      status: 'active',
      usage: 15234
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_test_1234567890123456789012345678901234567890',
      prefix: 'sk_test_',
      createdAt: new Date('2025-01-15'),
      lastUsed: new Date('2025-01-24'),
      expiresAt: new Date('2025-07-15'),
      permissions: ['read', 'write'],
      status: 'active',
      usage: 3421
    }
  ]);

  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);

  const generateAPIKey = () => {
    const prefix = 'sk_live_';
    const randomString = Array.from({ length: 32 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('');
    return prefix + randomString;
  };

  const createNewKey = () => {
    if (!newKeyName) return;

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generateAPIKey(),
      prefix: 'sk_live_',
      createdAt: new Date(),
      lastUsed: null,
      expiresAt: null,
      permissions: newKeyPermissions,
      status: 'active',
      usage: 0
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setNewKeyPermissions(['read']);
    setIsCreating(false);
    setShowKey(newKey.id);
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key)
    ));
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  const maskKey = (key: string) => {
    const prefix = key.substring(0, 8);
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'•'.repeat(24)}${suffix}`;
  };

  return(<div className="min-h-screen glass p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Key Management</h1>
          <p className="text-gray-600">Manage your API keys and access tokens</p>
        </div>

        {/* Security Notice */}
        <div className="glass bg-amber-50  -amber-200 rounded-xl-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-900">Keep your API keys secure</h3>
            <p className="text-sm text-amber-700 mt-1">
              Never share your secret API keys in publicly accessible areas such as GitHub, client-side code, or public websites.
            </p>
          </div>
        </div>

        {/* API Keys List */}
        <Card className="glass"
          <CardHeader className="glass"
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="glass"API Keys</CardTitle>
                <CardDescription className="glass"View and manage your API keys</CardDescription>
              </div>)
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent className="glass"
            <div className="space-y-4">
              {apiKeys.map(apiKey => (
                <div 
                  key={apiKey.id} 
                  className={`border rounded-lg p-4 ${
                    apiKey.status === 'revoked' ? 'bg-gray-50 opacity-60' : ''>}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <Badge variant={
                          apiKey.status === 'active' ? 'default' : 
                          apiKey.status === 'revoked' ? 'secondary' : >'outline'>}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="glass flex items-center gap-4 text-sm text-gray-500">)
                        <span>Created {apiKey.createdAt.toLocaleDateString()}</span>
                        {apiKey.lastUsed && (
                          <span>Last used {apiKey.lastUsed.toLocaleDateString()}</span>
                        )}
                        {apiKey.expiresAt && (
                          <span>Expires {apiKey.expiresAt.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apiKey.status === 'active' && (
                        <>
                          <Button
                            variant="outline">size="sm">onClick={() => revokeKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline">size="sm">onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKey === apiKey.id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* API Key Display */}
                  <div className="glass rounded-xl-lg p-3 flex items-center justify-between mb-3">
                    <code className="text-sm font-mono">
                      {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <Button
                      variant="ghost">size="sm">onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      disabled={apiKey.status !== 'active'}
                    >
                      {copiedKey === apiKey.id ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Permissions and Usage */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="glass flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Permissions:</span>
                        {apiKey.permissions.map(perm => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>)
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500">
                      {apiKey.usage.toLocaleString()} requests
                    </span>
                  </div>
                </div>
              ))}

              {apiKeys.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No API keys yet</p>
                  <p className="text-sm">Create your first API key to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Create New Key Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md glass
              <CardHeader className="glass"
                <CardTitle className="glass"Create New API Key</CardTitle>
              </CardHeader>
              <CardContent className="glass"
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Key Name</label>
                    <Input>value={newKeyName}>onChange={(e) => setNewKeyName(e.target.value)}
                      ="e.g., Production Server"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Permissions</label>
                    <div className="flex gap-2 mt-2">
                      {['read', 'write', 'delete'].map(perm => (
                        <label key={perm} className="flex items-center gap-2">
                          <input
                            type="checkbox")>checked={newKeyPermissions.includes(perm)}>onChange={(e) => {
                              if (e.target.checked) {
                                setNewKeyPermissions([...newKeyPermissions, perm]);
                              } else {
                                setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm));
                              }
                            }}
                          />
                          <span className="text-sm capitalize">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={createNewKey} disabled={!newKeyName}>
                      Create Key
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Best Practices */}
        <Card className="mt-6 glass
          <CardHeader className="glass"
            <CardTitle className="text-lg glassBest Practices</CardTitle>
          </CardHeader>
          <CardContent className="glass"
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Use environment variables to store API keys in your applications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Rotate your API keys regularly and revoke unused keys</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Use different keys for development and production environments</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Implement rate limiting and monitor API key usage</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}