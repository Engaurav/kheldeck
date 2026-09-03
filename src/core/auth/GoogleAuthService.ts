import { Platform } from 'react-native';
import { GoogleUserProfile } from '../types';

export const GOOGLE_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: any;
    handleGoogleCredentialResponse?: (response: any) => void;
  }
}

/**
 * Parses a standard Google JWT credential token without external libraries.
 */
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT token:', e);
    return null;
  }
}

/**
 * Loads the official Google Identity Services (GSI) script on Web.
 */
export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.google?.accounts?.id) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Initiates real Google OAuth 2.0 popup using Google's official authorization endpoint.
 */
export function launchGoogleOAuthPopup(
  clientId: string | undefined,
  onSuccess: (profile: GoogleUserProfile) => void,
  onError: (err: string) => void
): void {
  const activeClientId = clientId?.trim() || GOOGLE_CLIENT_ID;

  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    onError('Google OAuth popup is only available on Web.');
    return;
  }

  if (!activeClientId) {
    onError('Google Client ID is missing.');
    return;
  }

  try {
    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('email profile openid');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      activeClientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${scope}&prompt=select_account`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'google_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    if (!popup) {
      onError('Popup blocked! Please allow popups for localhost to sign in with Google.');
      return;
    }

    // Polling popup URL for access_token
    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer);
          return;
        }

        if (popup.location.href.includes('access_token')) {
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          clearInterval(timer);
          popup.close();

          if (accessToken) {
            // Fetch real user profile from Google UserInfo endpoint
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
              .then((res) => res.json())
              .then((googleData) => {
                const profile: GoogleUserProfile = {
                  uid: googleData.sub || 'g_' + Date.now(),
                  email: googleData.email || 'user@gmail.com',
                  displayName: googleData.name || googleData.email?.split('@')[0] || 'Player',
                  photoURL: googleData.picture,
                  authProvider: 'google',
                  createdAt: Date.now(),
                  lastLoginAt: Date.now(),
                };
                onSuccess(profile);
              })
              .catch((e) => onError('Failed to fetch Google profile: ' + e.message));
          }
        }
      } catch (crossOriginErr) {
        // Cross-origin access while navigating accounts.google.com is expected until redirected back
      }
    }, 500);
  } catch (err: any) {
    onError(err.message || 'OAuth error');
  }
}
