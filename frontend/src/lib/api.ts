/**
 * API Service for URL Shortener Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateUrlDto {
  originalUrl: string;
  customCode?: string;
}

export interface UrlResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  clickHistory: { date: string; count: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Create a shortened URL
 */
export const createShortUrl = async (data: CreateUrlDto): Promise<UrlResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create short URL');
  }

  const result: ApiResponse<UrlResponse> = await response.json();
  return result.data;
};

/**
 * Get all URLs
 */
export const getAllUrls = async (): Promise<UrlResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/api/urls`);

  if (!response.ok) {
    throw new Error('Failed to fetch URLs');
  }

  const result: ApiResponse<UrlResponse[]> = await response.json();
  return result.data;
};

/**
 * Get URL statistics by short code
 */
export const getUrlStats = async (shortCode: string): Promise<UrlResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/stats/${shortCode}`);

  if (!response.ok) {
    throw new Error('Failed to fetch URL stats');
  }

  const result: ApiResponse<UrlResponse> = await response.json();
  return result.data;
};

/**
 * Delete a URL by ID
 */
export const deleteUrl = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/urls/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete URL');
  }
};

/**
 * Redirect to original URL (this will be handled by backend)
 */
export const redirectUrl = (shortCode: string): string => {
  return `${API_BASE_URL}/${shortCode}`;
};
