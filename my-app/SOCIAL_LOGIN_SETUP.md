# Social Login Setup Guide

## Environment Variables Required

Aapko apne `.env.local` file me ye variables add karne honge:

```env
# Existing variables
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
SANITY_API_TOKEN=your_sanity_api_token
JWT_SECRET=your_jwt_secret

# NextAuth variables (REQUIRED)
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (REQUIRED)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth (REQUIRED)
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

## Google OAuth Setup

1. **Google Cloud Console** me jao: https://console.cloud.google.com/
2. **New Project** create karo ya existing project select karo
3. **APIs & Services** > **Credentials** me jao
4. **Create Credentials** > **OAuth 2.0 Client IDs** click karo
5. **Application type** me **Web application** select karo
6. **Authorized redirect URIs** me add karo:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. **Client ID** aur **Client Secret** copy karo

## Facebook OAuth Setup

1. **Facebook Developers** me jao: https://developers.facebook.com/
2. **Create App** ya existing app select karo
3. **Facebook Login** product add karo
4. **Settings** > **Basic** me app details fill karo
5. **Facebook Login** > **Settings** me **Valid OAuth Redirect URIs** add karo:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
6. **App ID** aur **App Secret** copy karo

## Sanity Schema Update

Aapke Sanity studio me jao aur user schema ko update karo. New fields add hui hain:
- `image`: Profile picture URL
- `provider`: Login provider (credentials/google/facebook)
- `providerId`: Provider ka unique ID
- `emailVerified`: Email verification date

## Testing

1. Development server start karo: `npm run dev`
2. Console me environment variables status check karo
3. Login/Signup page pe jao
4. Google ya Facebook buttons test karo
5. User Sanity me create hona chahiye

## Production Deployment

Production me deploy karne se pehle:
1. **NEXTAUTH_URL** ko production URL se update karo
2. **Authorized redirect URIs** me production URLs add karo
3. **NEXTAUTH_SECRET** ko strong random string se replace karo

## Troubleshooting

### Google Callback Error (302 redirect)
- **"Invalid redirect URI"** error: Check authorized redirect URIs in Google console
- **"Client ID not found"** error: Check GOOGLE_CLIENT_ID environment variable
- **"Client secret invalid"** error: Check GOOGLE_CLIENT_SECRET environment variable

### Signup ke baad Login Page Redirect
- **Environment variables missing**: Check all required variables are set
- **NextAuth configuration**: Ensure NEXTAUTH_SECRET and NEXTAUTH_URL are correct
- **Sanity permissions**: Check SANITY_API_TOKEN has write permissions

### Common Issues
1. **Environment variables not loading**: Restart development server after adding .env.local
2. **Google/Facebook app not configured**: Ensure OAuth apps are properly set up
3. **Sanity schema not updated**: Update user schema in Sanity studio
4. **CORS issues**: Check if redirect URIs match exactly

### Debug Steps
1. Check browser console for errors
2. Check server console for environment variable status
3. Verify Google/Facebook app settings
4. Test with credentials login first
5. Check Sanity studio for user creation

## Quick Fix Commands

```bash
# Restart development server
npm run dev

# Check environment variables
node -e "console.log(process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing')"

# Clear browser cache and cookies
# Then test again
``` 