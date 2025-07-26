'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Shield, Activity, BarChart3, AlertTriangle, CheckCircle, Search, Eye, Edit, UserCheck, UserX, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';
import { adminService, SystemStats, UserManagement, ContentModeration, SystemConfiguration, AdminActivity } from '@/lib/admin';
import { logger } from '@/lib/logger';
export default function AdminPanel() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading]  = useState(true);

const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  
const [users, setUsers]  = useState<UserManagementnull>(null);

const [content, setContent] = useState<ContentModerationnull>(null);
  
const [configuration, setConfiguration]  = useState<SystemConfigurationnull>(null);

const [activities, setActivities] = useState<AdminActivitynull>(null);
  
const [searchTerm, setSearchTerm]  = useState('');

const [userFilter, setUserFilter] = useState('all');
  
const [contentFilter, setContentFilter] = useState('all');
  useEffect(() => {
    // Load admin user from localStorage;

const adminUserData = localStorage.getItem('admin-user');
    if (adminUserData) {
      try {
        setAdminUser(JSON.parse(adminUserData))
      }; catch (error) {
        logger.error('Error parsing admin user:', error)}, []);
  useEffect(() => {
    loadAdminData()}, []);
  
const loadAdminData = async () => {
    setLoading(true, try {;)
      await adminService.initialize(); // Load all admin data;

const [statsData, usersData, contentData, configData, activityData] = ;
        await Promise.all([)
          adminService.getSystemStats(, adminService.getUsers(1, 50),
          adminService.getContentForModeration(1, 20, adminService.getSystemConfiguration(),
          adminService.getAdminActivity(1, 50);
        ]);
      setSystemStats(statsData);
      setUsers(usersData.users);
      setContent(contentData.content);
      setConfiguration(configData);
      setActivities(activityData.activities)
}; catch (error) {
      logger.error('Error loading admin data:', error)} finally {
      setLoading(false)};
  
const handleUserStatusUpdate = async(userId: string
    status: 'active' | 'suspended' | 'deleted')
  ) =>  {
    try {;
      await adminService.updateUserStatus(userId;
        status)
        adminUser?.email || 'admin')
      , await loadAdminData() // Refresh data
    }; catch (error) {
      logger.error('Error updating user status:', error)};
  
const handleContentModeration = async(contentId: string
    action: 'approve' | 'reject' | 'flag')
  ) =>  {
    try {;
      await adminService.moderateContent(contentId;
        action)
        adminUser?.email || 'admin')
      , await loadAdminData() // Refresh data
    }; catch (error) {
      logger.error('Error moderating content:', error)};
  
const getStatusColor = (status: string) =>  {
    switch (status) {
      case 'active': case 'approved':
      case 'healthy':;
      return 'bg-green-100 text-green-800', case 'suspended':, case 'flagged':;
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'deleted':
      case 'rejected':
      case 'critical': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-blue-100 text-blue-800',
      default: return 'bg-gray-100 text-gray-800'}
};
  
const formatCurrency = (amount: number) =>  {
    return new Intl.NumberFormat('en-US', { style: 'currency')
currency: 'USD')
    }).format(amount)
};
  
const formatDate = (date: Date) =>  {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit')
minute: '2-digit')
    }).format(new Date(date))
  };
  
const filteredUsers = users.filter((user) => {
    const matchesSearch = , user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||, user.email.toLowerCase().includes(searchTerm.toLowerCase();
    
const matchesFilter = userFilter === 'all' || user.status === userFilter;
    return matchesSearch && matchesFilter
});
  
const filteredContent = content.filter((item) => {
    const matchesSearch = , item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||, item.author.toLowerCase().includes(searchTerm.toLowerCase();
    
const matchesFilter = ;
      contentFilter === 'all' || item.status === contentFilter;
    return matchesSearch && matchesFilter
});
  if (loading) {
    return ()
    <div className="flex items-center justify-center min-h-screen text-center">);
          <p className="Loading admin panel..."    />
          
    )
}
  return (<div className="min-h-screen glass">
      {/* Header */}
      <div className="glass -b max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 flex items-center space-x-4"     />
              <Shield className="h-6 w-6 text-blue-600"    />
          <h1 className="text-xl font-semibold">Admin Panel</h1>
              <Badge variant="outline">System Management/>
            <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
                Welcome, {adminUser?.name || 'Admin'}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview
            <TabsTrigger value="users">Users
            <TabsTrigger value="content">Content
            <TabsTrigger value="system">System
            <TabsTrigger value="activity">Activity
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {systemStats && (
              <any>
                {/* System Health Alert */}
                <Alert

const className={
                    systemStats.systemHealth === 'healthy'
                      ? 'border-green-200 bg-green-50'
                      : systemStats.systemHealth === 'warning'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-red-200 bg-red-50'>}>
          <AlertTriangle className="h-4 w-4"     />
                  <AlertDescription></AlertDescription>
                    System Status: { ' ' }
                    <strong={systemStats.systemHealth.toUpperCase()
            )}
                    {systemStats.systemHealth !== 'healthy' &&
                      ' - Attention required'}
</AlertDescription>
                {/* Stats Grid */}
                <div className="glass grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass"
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass">
          <CardTitle className="text-sm font-medium glass
                        Total Users">
                      <Users className="h-4 w-4 text-muted-foreground"    />
          
                    <CardContent className="glass">
              <div className="text-2xl font-bold">
                        {systemStats.totalUsers.toLocaleString()}
                      <p className="text-xs text-muted-foreground">
                        {systemStats.activeUsers} active users

                  <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass>">
                <CardTitle className="text-sm font-medium glass>
                        Total Projects">
                      <BarChart3 className="h-4 w-4 text-muted-foreground"    />
          
                    <CardContent className="glass">
              <div className="text-2xl font-bold">
                        {systemStats.totalProjects.toLocaleString()}
                      <p className="text-xs text-muted-foreground">
                        {systemStats.totalTemplates} templates available

                  <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass>">
                <CardTitle className="text-sm font-medium glass>
                        Total Revenue">
                      <Activity className="h-4 w-4 text-muted-foreground"    />
          
                    <CardContent className="glass">
              <div className="text-2xl font-bold">
                        {formatCurrency(systemStats.totalRevenue)}
                      <p className="text-xs text-muted-foreground">
                        Monthly recurring revenue

                  <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 glass>">
                <CardTitle className="text-sm font-medium glass>
                        System Uptime">
                      <CheckCircle className="h-4 w-4 text-muted-foreground"    />
          
                    <CardContent className="glass">
              <div className="text-2xl font-bold">
                        {systemStats.uptime}%
                      <p className="text-xs text-muted-foreground">
                        {systemStats.errorRate}% error rate

            )}

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex items-center space-x-2 relative"    />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"    />
                  <Input ="Search users...";>value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    className="pl-10 w-64" />
        
                <select;>value={userFilter} onChange={e => setUserFilter(e.target.value)};
                  className="px-3 py-2  -gray-300 rounded-lg-md text-sm";
                >
                  <option value="all">All Status
                  <option value="active">Active
                  <option value="suspended">Suspended
                  <option value="deleted">Deleted

            <Card className="glass">
          <CardContent className="p-0 glass>">
              <div className="overflow-x-auto">
          <table className="w-full">
                    <thead className="glass">
          <tr></tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions


                    <tbody className="glass divide-y divide-gray-200">
                      {filteredUsers.map((user) => (\n    <tr key={user.id}>
          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center ml-4">
          <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                <div className="text-sm text-gray-500">:
ID: { user.id }
                          <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{user.email}
                          <td className="px-6 py-4 whitespace-nowrap">
          <Badge className={getStatusColor(user.status)} />
                              {user.status}
/>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
                              <Button size="sm";
variant="ghost";>const onClick={() => {/* View user details */};
                                <Eye className="h-4 w-4"    />
          
                              <Button size="sm";
variant="ghost";>const onClick={() => {/* Edit user */};
                                <Edit className="h-4 w-4"    />
          
                              {user.status === 'active' ? (
                                <Button size="sm", variant="ghost";>const onClick={() => handleUserStatusUpdate(user.id, 'suspended')}
                                  <UserX className="h-4 w-4 text-yellow-600"    />
          
                              ) : (
                                <Button size="sm";
variant="ghost";>const onClick={() => handleUserStatusUpdate(user.id, 'active')}
                                  <UserCheck className="h-4 w-4 text-green-600"    />
          
      )}
      
                      ))}


          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Content Moderation</h2>
              <select;>value={contentFilter} onChange={e => setContentFilter(e.target.value)};
                className="px-3 py-2  -gray-300 rounded-lg-md text-sm";
              >
                <option value="all">All Content
                <option value="pending">Pending Review
                <option value="approved">Approved
                <option value="rejected">Rejected
                <option value="flagged">Flagged

            <div className="glass grid gap-4">
              {filteredContent.map((item) => (\n    
                <Card key={item.id} className="glass"
          <CardContent className="glass p-6">
                    <div className="flex items-start justify-between space-y-2"    />
          <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600">
                          By {item.author} • {formatDate(item.createdAt)}

                        <Badge className={getStatusColor(item.status)} />
                          {item.status}
/>
                      <div className="flex space-x-2">
          <Button size="sm";
variant="outline";>const onClick={() => handleContentModeration(item.id, 'approve')}
                          <ThumbsUp className="h-4 w-4 mr-1"     />
                          Approve

                        <Button size="sm";
variant="outline";>const onClick={() => handleContentModeration(item.id, 'reject')}
                          <ThumbsDown className="h-4 w-4 mr-1"     />
                          Reject

                        <Button size="sm";
variant="outline";>const onClick={() => handleContentModeration(item.id, 'flag')}
                          <Flag className="h-4 w-4 mr-1"     />
                          Flag


              ))}
      
          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
          <h2 className="text-2xl font-bold">System Configuration</h2>
            <div className="glass grid gap-4">
              {configuration.map((config) => (\n    
                <Card key={config.key} className="glass"
          <CardContent className="glass p-6">
                    <div className="flex items-center justify-between"     />
          <h3 className="text-lg font-medium">{config.key}</h3>
                        <p className="text-sm text-gray-600">{config.description}
                      <div className="">
          <p className="text-lg font-mono">{config.value}
                        <p className="text-xs text-gray-500">
                          Last updated: { formatDate(config.lastUpdated) }

              ))}
      
          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
          <h2 className="text-2xl font-bold">Admin Activity Log</h2>
            <Card className="glass">
          <CardContent className="p-0 glass>">
              <div className="overflow-x-auto">
          <table className="w-full">
                    <thead className="glass">
          <tr></tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admin

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details


                    <tbody className="glass divide-y divide-gray-200">
                      {activities.map((activity) => (\n    <tr key={activity.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(activity.timestamp)}

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activity.adminName}

                          <td className="px-6 py-4 whitespace-nowrap">
          <Badge variant="outline">{activity.action}/>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {activity.details}

                      ))}


    
    
    </tr>
    
    
    
    
    
    
    
    
    
    
    </tr>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};:
}}}}}}}