# Deployment Guide

This guide will help you deploy your Next.js blog application successfully.

## Environment Variables Setup

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following environment variables:

#### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Authentication
BETTER_AUTH_SECRET=your-secure-random-secret-here
BETTER_AUTH_URL=https://your-domain.com

# Database (Supabase)
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ImageKit.io (Optional)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your-imagekit-endpoint
```

### Generating Secrets

#### BETTER_AUTH_SECRET

Generate a secure random string:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Build Issues & Solutions

### 1. Database Connection Errors

If you see `Environment variable not found: DATABASE_URL` errors:

- Ensure all database environment variables are set in your deployment platform
- Check that your database is accessible from the deployment environment
- Verify your connection strings are correct

### 2. Dynamic Server Usage Errors

If you see `Dynamic server usage` errors:

- Admin pages are configured with `export const dynamic = 'force-dynamic'`
- This is expected for admin functionality that requires server-side rendering

### 3. Missing Environment Variables

- Double-check all required environment variables are set
- Use the `.env.example` file as a reference
- Ensure production values are different from development values

## Pre-deployment Checklist

- [ ] All environment variables are set in your deployment platform
- [ ] Database is accessible and contains required tables
- [ ] BETTER_AUTH_SECRET is set to a secure random value
- [ ] NEXT_PUBLIC_SITE_URL matches your production domain
- [ ] Google OAuth credentials are configured (if using social login)
- [ ] ImageKit.io credentials are configured (if using image optimization)

## Deployment Steps

1. **Push your code** to your Git repository
2. **Set environment variables** in your deployment platform
3. **Deploy** - the build should now complete successfully
4. **Test** your deployed application
5. **Monitor** for any runtime errors

## Troubleshooting

### Build Fails with Prisma Errors

```bash
# Ensure your DATABASE_URL is accessible during build
# Check your database connection string format
```

### Static Generation Errors

```bash
# Admin pages are configured to use dynamic rendering
# This is expected and normal for admin functionality
```

### Authentication Issues

```bash
# Verify BETTER_AUTH_SECRET is set
# Check BETTER_AUTH_URL matches your domain
# Ensure Google OAuth credentials are correct (if using)
```

## Performance Optimization

The application includes several optimizations:

- Static page generation where possible
- Dynamic rendering for admin pages
- Optimized bundle splitting
- Image optimization with ImageKit.io
- Caching strategies

## Support

If you encounter issues during deployment:

1. Check the build logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your database is accessible
4. Check that your domain configuration is correct
