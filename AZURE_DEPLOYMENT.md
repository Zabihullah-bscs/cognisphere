# Deployment to Azure Web Apps

This guide explains how to deploy the Cognisphere application to Azure Web Apps.

## Prerequisites

1. An Azure account with an active subscription
2. Node.js installed locally
3. Azure CLI installed

## Steps to Deploy

1. Create an Azure Web App:
```powershell
az login
az group create --name cognisphere-rg --location eastus
az appservice plan create --name cognisphere-plan --resource-group cognisphere-rg --sku B1 --is-linux
az webapp create --name cognisphere --resource-group cognisphere-rg --plan cognisphere-plan --runtime "NODE|18-lts"
```

2. Configure Environment Variables:
- Go to Azure Portal > Your Web App > Configuration > Application settings
- Add the following environment variables:
  - PORT
  - JWT_SECRET
  - ADMIN_EMAIL
  - ADMIN_PASSWORD
  - EMAIL_HOST
  - EMAIL_PORT
  - EMAIL_USER
  - EMAIL_PASSWORD
  - DATABASE_URL (if using external database)

3. Deploy the Application:
```powershell
az webapp deployment source config-local-git --name cognisphere --resource-group cognisphere-rg
git remote add azure <URL_FROM_PREVIOUS_COMMAND>
git push azure main
```

4. Monitor the Application:
- Go to Azure Portal > Your Web App > Overview
- Check the Application Logs and Metrics

## Database Considerations

The application currently uses SQLite which stores data in a file. For production:
1. Consider migrating to Azure Database for MySQL or PostgreSQL
2. Update the database connection logic in `services/databaseService.js`
3. Add the database connection string to Application Settings

## SSL/TLS Configuration

1. Azure provides free SSL certificates with custom domains
2. Configure custom domain in Azure Portal > Your Web App > Custom domains
3. Enable HTTPS Only in Azure Portal > Your Web App > TLS/SSL settings

## Monitoring and Logging

1. Enable Application Insights
2. Set up alerts for key metrics
3. Configure diagnostic settings for logs

## Scaling

The B1 plan allows for manual scaling. To enable auto-scaling:
1. Upgrade to Standard tier (S1) or higher
2. Configure auto-scaling rules in Azure Portal > Your Web App > Scale out
