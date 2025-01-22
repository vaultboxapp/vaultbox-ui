import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

export function getToken() {
  const token = Cookies.get('token'); // Retrieve the token from the cookie
  console.log('Token retrieved from cookie:', token); // Log the token
  return token;
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return false;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
}