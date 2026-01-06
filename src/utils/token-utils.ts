// src/utils/token-utils.ts

import { Buffer } from 'buffer';

export const generateToken = (userId: number, email: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userIdentifier = `${userId}-${email}`;

  const tokenData = {
    userId,
    email,
    timestamp,
    random,
  };

  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

  return `Bearer_${token}`;
};

export const decodeToken = (token: string): {userId: number; email: string; timestamp: number} | null => {
  try {
    const tokenWithoutPrefix = token.replace('Bearer_', '');

    const decoded = Buffer.from(tokenWithoutPrefix, 'base64').toString('utf-8');
    const tokenData = JSON.parse(decoded);

    return {
      userId: tokenData.userId,
      email: tokenData.email,
      timestamp: tokenData.timestamp,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);

    if (!decoded) {
      return true;
    }

    const now = Date.now();
    const tokenAge = now - decoded.timestamp;
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    return tokenAge > expirationTime;
  } catch (error) {
    return true;
  }
};

export const isValidToken = (token: string): boolean => {
  if (!token || !token.startsWith('Bearer_')) {
    return false;
  }

  const decoded = decodeToken(token);
  return decoded !== null && !isTokenExpired(token);
};
