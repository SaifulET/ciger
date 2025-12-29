// utils/utility.ts

/**
 * Handles unauthorized responses (HTTP 401)
 * Clears all stored data and redirects user to /login
 */
export function unauthorized(code: number): void {
  if (typeof window !== "undefined" && code === 401) {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  }
}

/**
 * Save user email to sessionStorage
 */
export function setEmail(email: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("email", email);
  }
}

/**
 * Retrieve user email from sessionStorage
 */
export function getEmail(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("email");
  }
  return null;
}



export const clearAllAuthData = () => {
  // Clear ALL localStorage items for this domain
  localStorage.clear();
  
  // Clear ALL sessionStorage items
  sessionStorage.clear();
  
  // Clear cookies (this only works for cookies accessible via JavaScript)
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
  });
  
  console.log("All auth data cleared")
}
export const setAuthToken = (token: string, rememberMe = false): void => {
  if (typeof window === 'undefined') return;
  
  if (rememberMe) {
    localStorage.setItem('auth_token', token);
    // Set a flag to indicate this is a persistent session
    localStorage.setItem('persistent_session', 'true');
  } else {
    // Session storage will clear when tab closes
    sessionStorage.setItem('auth_token', token);
    // Remove persistent flag if it exists
    localStorage.removeItem('persistent_session');
  }
};
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
};