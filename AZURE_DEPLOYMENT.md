# Azure Deployment Guide

## Prerequisites
1. Azure account with an active subscription
2. GitHub account with the repository pushed
3. Node.js installed locally
4. Azure CLI installed

## Pre-deployment Steps

1. Create a `.env` file from `env.example` and set all required variables
2. Make sure all dependencies are installed:
   ```bash
   npm install
   ```
3. Test the application locally:
   ```bash
   npm run dev
   ```

## Deployment Steps

### 1. Azure Setup
1. Log in to Azure Portal (portal.azure.com)
2. Create a new Resource Group
3. Create a new App Service
   - Select Node.js as the runtime stack
   - Choose Free F1 tier for testing
   - Enable GitHub Actions deployment

### 2. GitHub Setup
1. Push your code to GitHub repository
2. Set up GitHub Actions workflow
3. Add the following secrets in GitHub repository:
   - AZURE_CREDENTIALS
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASS
   - ADMIN_TOKEN

### 3. Database Setup
1. Create an Azure Storage account for SQLite file storage
2. Update the DB_PATH in application settings

### 4. Configure App Settings
In Azure Portal, add these application settings:
- NODE_ENV=production
- All other environment variables from your .env file

## Post-deployment
1. Verify the application is running
2. Test all routes and functionalities
3. Monitor application insights
4. Set up SSL certificate if using custom domain

## Troubleshooting
- Check application logs in Azure Portal
- Verify GitHub Actions workflow execution
- Check if all environment variables are properly set
- Verify database connectivity
