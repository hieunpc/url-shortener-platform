import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';

export interface UrlData {
  id: string;
  userId?: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  clickCount?: number; // Backend uses clickCount
  createdAt: string;
  clickHistory: { date: string; count: number }[];
}

export const useUrls = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUrls();
    } else {
      setUrls([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadUrls = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllUrls();
      
      // Transform backend response to frontend format
      const transformedUrls: UrlData[] = data.map((url) => ({
        id: url.id,
        userId: user?.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clickCount || 0,
        createdAt: url.createdAt,
        clickHistory: url.clickHistory || [],
      }));
      
      setUrls(transformedUrls);
    } catch (error) {
      console.error('Failed to load URLs:', error);
      setUrls([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createUrl = async (originalUrl: string): Promise<UrlData | null> => {
    if (!user) return null;

    try {
      const data = await api.createShortUrl({ originalUrl });
      
      const newUrl: UrlData = {
        id: data.id,
        userId: user.id,
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        clicks: data.clickCount || 0,
        createdAt: data.createdAt,
        clickHistory: data.clickHistory || [],
      };
      
      setUrls((prev) => [...prev, newUrl]);
      return newUrl;
    } catch (error) {
      console.error('Failed to create URL:', error);
      return null;
    }
  };

  const deleteUrl = async (id: string) => {
    try {
      await api.deleteUrl(id);
      // Remove from local state after successful deletion
      setUrls((prev) => prev.filter((url) => url.id !== id));
    } catch (error) {
      console.error('Failed to delete URL:', error);
      throw error;
    }
  };

  const recordClick = async (shortCode: string) => {
    // Clicks are automatically recorded by backend on redirect
    // Refresh the URL list to get updated counts
    await loadUrls();
  };

  const getUrlByShortCode = (shortCode: string): UrlData | null => {
    return urls.find((url) => url.shortCode === shortCode) || null;
  };

  return {
    urls,
    isLoading,
    createUrl,
    deleteUrl,
    recordClick,
    getUrlByShortCode,
    refreshUrls: loadUrls,
  };
};
