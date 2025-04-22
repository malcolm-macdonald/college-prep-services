# Deploying to Railway

This guide explains how to deploy this College Prep Services application to Railway.

## Prerequisites

1. A [Railway](https://railway.app/) account
2. A [GitHub](https://github.com/) account with this repository pushed to it
3. Set up Google Calendar API credentials:
   - Create a service account in Google Cloud Platform
   - Enable the Google Calendar API
   - Download service account credentials
4. Set up Stripe account and API keys (for payments)

## Deployment Steps

1. **Fork/Clone the Repository**
   - Make sure your code is in a GitHub repository

2. **Connect to Railway**
   - Log in to Railway
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Click "Deploy Now"

3. **Configure Environment Variables**
   - In your Railway project dashboard, go to "Variables"
   - Add all the required environment variables listed in the `RAILWAY_ENV_VARS.md` file
   - Make sure to properly format your `GOOGLE_PRIVATE_KEY` with newline characters

4. **Deploy**
   - Railway will automatically deploy your application
   - It will use the build and start scripts defined in package.json:
     - `npm run build`: Builds both frontend and backend
     - `npm start`: Starts the production server

5. **Generate Domain**
   - In your Railway project, go to "Settings"
   - Under "Domains", click "Generate Domain"
   - Your application will be available at this domain

## Troubleshooting

1. **Build Failures**
   - Check the deployment logs in Railway
   - Ensure all dependencies are correctly specified in package.json

2. **Environment Variable Issues**
   - Double-check that all required variables are set
   - Ensure `GOOGLE_PRIVATE_KEY` is correctly formatted

3. **Google Calendar API Connection Issues**
   - Verify service account has correct permissions
   - Check that the calendar ID is correct

4. **Stripe Integration Issues**
   - Verify Stripe API keys are correct
   - Ensure webhook endpoints are properly configured

## Maintenance

- **Updating the Application**
  - Push changes to your GitHub repository
  - Railway will automatically redeploy

- **Viewing Logs**
  - Go to your project in Railway
  - Click on "Deployments"
  - Select the current deployment
  - Click "View Logs" 