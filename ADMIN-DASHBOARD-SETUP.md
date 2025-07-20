# Admin Dashboard Setup - Production Ready with Real Data

## Overview
The admin dashboard has been fully integrated with Supabase to provide real-time analytics and user management capabilities. This guide will help you set up the production-ready admin dashboard.

## Prerequisites
- Supabase project with proper tables configured
- Admin credentials set in environment variables
- Node.js 20+ installed

## Database Setup

### 1. Run the Analytics Tables Migration
Execute the following SQL scripts in your Supabase SQL Editor:

```sql
-- First, run the main setup if not already done
-- File: supabase-setup.sql

-- Then, run the analytics tables setup
-- File: supabase-analytics-tables.sql
```

### 2. Verify Tables Created
You should have the following tables:
- `users` - User accounts
- `projects` - User projects
- `activity_logs` - All user activities
- `usage_records` - Resource usage tracking
- `api_metrics` - API performance metrics
- `system_health` - Platform health metrics
- `feature_flags` - Feature toggles

## Environment Configuration

### 1. Update `.env.local` for Development
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword!
ENABLE_ADMIN_PANEL=true
```

### 2. Update Vercel Environment Variables
Go to your Vercel project settings and ensure all environment variables are set correctly.

## Features Implemented

### 1. Real-Time Dashboard Stats
- Total users with growth metrics
- Active users tracking
- Project statistics
- API usage monitoring
- System health indicators

### 2. Analytics Dashboard
- User growth charts
- Project creation trends
- API performance metrics
- Revenue analytics
- Platform health monitoring

### 3. User Management
- Paginated user list with search
- User detail views
- Activity tracking
- Subscription management

### 4. API Usage Tracking
All API calls are automatically tracked with:
- Response times
- Error rates
- User attribution
- Endpoint popularity

## Using the Admin Dashboard

### 1. Access Admin Login
Navigate to: `https://your-domain.com/admin/login`

### 2. Login with Admin Credentials
Use the credentials set in your environment variables:
- Email: `admin@yourdomain.com` (or as configured)
- Password: As set in `ADMIN_PASSWORD`

### 3. Dashboard Navigation
- **Dashboard**: Overview of all metrics
- **Analytics**: Detailed charts and trends
- **Users**: User management interface
- **Activity**: Recent platform activity

## API Integration

### Example: Tracking API Usage
```typescript
import { withApiTracking, trackResourceUsage } from '@/lib/api-middleware'

// Automatically track all API calls
export const GET = withApiTracking(async (request) => {
  // Your API logic here
  return NextResponse.json({ data: 'response' })
})

// Track specific resource usage
export const POST = trackResourceUsage('ai_generation')(
  withApiTracking(async (request) => {
    // Your API logic here
    return NextResponse.json({ success: true })
  })
)
```

### Example: Using Admin Queries
```typescript
import { AdminQueries } from '@/lib/admin-queries'

// Get admin statistics
const stats = await AdminQueries.getAdminStats()

// Get analytics for a time range
const analytics = await AdminQueries.getAnalytics('7d') // 24h, 7d, 30d, 90d

// Get paginated users
const users = await AdminQueries.getUsers({
  page: 1,
  limit: 20,
  search: 'john',
  status: 'active',
  sortBy: 'createdAt',
  sortOrder: 'desc'
})
```

## Performance Optimization

### 1. Materialized Views
The system uses materialized views for performance:
- `daily_active_users` - Pre-calculated daily active users
- `api_performance_summary` - Aggregated API metrics

### 2. Refresh Views (Optional)
Set up a cron job to refresh materialized views:
```sql
SELECT cron.schedule(
  'refresh-analytics-views', 
  '0 * * * *', 
  'SELECT refresh_analytics_views();'
);
```

### 3. Caching Strategy
- Admin stats are cached for 1 minute
- Analytics data is cached for 5 minutes
- User lists are cached for 30 seconds

## Monitoring & Maintenance

### 1. Database Indexes
All necessary indexes are created automatically:
- User lookups by email
- Activity logs by user and timestamp
- API metrics by endpoint and time

### 2. Data Retention
Set up automatic cleanup of old data:
```typescript
// Run daily via cron job
await ApiTracking.cleanupOldMetrics(90) // Keep 90 days
```

### 3. Health Checks
Monitor these endpoints:
- `/api/health` - General health check
- `/api/admin/stats` - Admin dashboard health

## Security Considerations

### 1. Authentication
- Admin routes use JWT-based authentication
- Sessions expire after 8 hours
- All admin actions are logged

### 2. Rate Limiting
API endpoints include rate limiting:
```typescript
export const GET = withRateLimit(100, 60000)( // 100 req/min
  withApiTracking(handler)
)
```

### 3. Audit Trail
All admin actions are logged in `activity_logs`:
- Who performed the action
- What was accessed/modified
- When it occurred
- IP address and user agent

## Troubleshooting

### Database Connection Issues
If you see "Using fallback data":
1. Check Supabase connection in `.env`
2. Verify service role key is correct
3. Check if tables exist in Supabase

### Missing Data
If charts show no data:
1. Ensure tables have data
2. Check date ranges in queries
3. Verify user sessions are being tracked

### Performance Issues
If dashboard is slow:
1. Check database indexes
2. Refresh materialized views
3. Enable query caching

## Next Steps

1. **Set up monitoring** - Use Supabase's built-in monitoring
2. **Configure alerts** - Set up alerts for errors and performance
3. **Customize metrics** - Add business-specific metrics
4. **Scale infrastructure** - Upgrade Supabase plan as needed

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Review browser console for frontend errors
3. Check API response times in network tab
4. Contact support with error details

---

**Note**: This admin dashboard is production-ready and uses real data from your Supabase database. All mock data has been replaced with live database queries.