import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Redirect = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (shortCode) {
      // Redirect directly to backend endpoint
      // Backend will handle the redirect and click tracking
      window.location.href = `${API_BASE_URL}/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Đang chuyển hướng...</p>
    </div>
  );
};

export default Redirect;
