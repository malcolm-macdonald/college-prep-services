# Railway Environment Variables

When deploying to Railway, you'll need to set the following environment variables in your project:

## Frontend Configuration
- `VITE_API_BASE_URL`: The URL of your Railway deployment (leave empty to use same-origin URLs)

## Server Configuration
- `PORT`: Will be set by Railway automatically (don't set this)

## Google Calendar API
- `GOOGLE_CALENDAR_ID`: Your Google Calendar ID
- `ADMIN_CALENDAR_ID`: Admin Calendar ID (can be the same as GOOGLE_CALENDAR_ID)
- `GOOGLE_CLIENT_EMAIL`: Service account email from Google Cloud Platform
- `GOOGLE_PRIVATE_KEY`: Service account private key from Google Cloud Platform (include all chars)

## Email Configuration
- `ADMIN_EMAIL`: Email address for admin notifications
- `EMAIL_USER`: Email account for sending appointment notifications
- `EMAIL_PASSWORD`: Password for the email account

## Stripe API
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Webhook secret for verifying Stripe events
- `STRIPE_PRICE_ID`: The price ID for the service being sold

## Important Notes

1. Set these environment variables in Railway by going to:
   - Your project → Settings → Environment Variables

2. Make sure your `GOOGLE_PRIVATE_KEY` is properly formatted with \n characters.

3. For production, set `VITE_API_BASE_URL` to empty to use relative URLs for API calls. 