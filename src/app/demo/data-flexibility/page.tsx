import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
export default function DataFlexibilityPage() {
  // Mock data to demonstrate flexibility
  const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' }
   ];
  const products = [
  { id: 1, name: 'AI Assistant Pro', price: 99.99, category: 'Software' },
    { id: 2, name: 'Data Analytics Suite', price: 149.99, category: 'Analytics' }
   ];
  const orders = [
  { id: 1, userId: 1, productId: 1, total: 99.99, status: 'completed' },
    { id: 2, userId: 2, productId: 2, total: 149.99, status: 'pending' }
   ];
  const _analytics = {
    pageViews: 15420,
    conversions: 342,
    revenue: 8950.50
  };
  // Flexible data structure
  const dashboardData = {
    users,
    products,
    orders,
    analytics,
    stats: {
  totalUsers: users.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.reduce((sum: number, order) => sum + order.total, 0)
}
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Flexibility Demo
          </h1>
          <p className="text-gray-600">
            Demonstrating flexible data structures and real-time processing capabilities.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {dashboardData.stats.totalUsers}
              </div>
              <p className="text-sm text-gray-600">Active users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {dashboardData.stats.totalProducts}
              </div>
              <p className="text-sm text-gray-600">Available products</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {dashboardData.stats.totalOrders}
              </div>
              <p className="text-sm text-gray-600">Total orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                ${dashboardData.stats.revenue.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Total revenue</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">{dashboardData.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.category}</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${product.price}
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
              </div>
);

          </div>
}
