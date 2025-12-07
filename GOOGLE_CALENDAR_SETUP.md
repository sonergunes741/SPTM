# Google Calendar Integration Setup Guide

## Overview

This guide explains how to set up Google Calendar integration for the Smart Personal Task Manager (SPTM).

## Prerequisites

- A Google Account
- Access to Google Cloud Console (https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project selector dropdown at the top
3. Click "NEW PROJECT"
4. Enter "SPTM" as the project name
5. Click "CREATE"
6. Wait for the project to be created (this may take a few moments)

## Step 2: Enable Google Calendar API

1. In the Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on the "Google Calendar API" result
4. Click the "ENABLE" button
5. You'll be redirected to the API details page

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" and select "OAuth 2.0 Client ID"
3. If prompted, click "CONFIGURE OAUTH CONSENT SCREEN"
4. Select "External" for user type and click "CREATE"
5. Fill in the OAuth consent screen:
   - **App name**: Smart Personal Task Manager
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - Click "SAVE AND CONTINUE"
6. Skip the scopes and click "SAVE AND CONTINUE"
7. Add yourself as a test user:
   - Click "ADD USERS"
   - Enter your Google account email
   - Click "SAVE AND CONTINUE"
8. Return to **Credentials**

## Step 4: Create OAuth 2.0 Client ID

1. Click "CREATE CREDENTIALS" and select "OAuth 2.0 Client ID"
2. Select "Web application" as the Application type
3. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using a different port)
   - Your production domain (when deploying)
4. Under "Authorized redirect URIs", add the same URLs
5. Click "CREATE"
6. Copy the **Client ID** from the popup (you'll need this)

## Step 5: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" and select "API Key"
3. Copy the API Key from the popup (you'll need this)

## Step 6: Configure Environment Variables

1. In your SPTM project root directory, create or edit `.env.local`:

```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

2. Replace `your_client_id_here` and `your_api_key_here` with the values from steps 4 and 5

## Step 7: Install Dependencies

The required packages should already be installed:

```bash
npm install @react-oauth/google gapi-script
```

## Step 8: Test the Integration

1. Start the development server:

```bash
npm run dev
```

2. Open the app in your browser (typically `http://localhost:5173`)
3. In the sidebar, you should see the "Connect Google Calendar" widget
4. Click "Sign in with Google" and authorize the application
5. Once authenticated, you'll see sync buttons to:
   - **Sync Tasks to Calendar**: Add your SPTM tasks to Google Calendar
   - **Fetch Calendar Events**: Import events from Google Calendar

## Features

### Sync Tasks to Calendar

- Automatically creates calendar events for all tasks with due dates
- Synced tasks include:
  - Task title
  - Task description and priority
  - Due date and estimated 1-hour duration
  - Mission and context information

### Fetch Calendar Events

- Retrieves events from your Google Calendar
- Displays them in the SPTM calendar view
- Helps with planning and scheduling

### Two-Way Integration

- Create tasks in SPTM and sync them to Google Calendar
- View Google Calendar events within SPTM

## Troubleshooting

### "Failed to authenticate with Google"

- Verify your credentials are correct in `.env.local`
- Check that your OAuth consent screen is configured
- Ensure you've added yourself as a test user
- Clear browser cookies and try again

### "Failed to fetch calendar events"

- Verify the Google Calendar API is enabled in Cloud Console
- Check that your API key and Client ID are valid
- Verify the required OAuth scopes are configured

### CORS Issues

- Make sure your domain is added to both:
  - Authorized JavaScript origins
  - Authorized redirect URIs

### Events not syncing

- Verify the task has a due date set
- Check that you're authenticated with Google
- Look at the browser console for error messages

## Security Notes

- **Never commit `.env.local`** to version control - it's in `.gitignore`
- Keep your API keys and Client IDs private
- Use environment variables for all sensitive information
- For production, use a backend service to handle sensitive tokens

## Next Steps

- Configure more detailed OAuth consent screen branding
- Set up production credentials and domain
- Implement bi-directional sync (edit calendar events from SPTM)
- Add support for multiple calendars
- Implement conflict resolution for updates

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2/web-server-flow)
- [React OAuth Google Library](https://www.npmjs.com/package/@react-oauth/google)
