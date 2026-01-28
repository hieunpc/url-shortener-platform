import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUrls, UrlData } from '@/hooks/useUrls';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Link2, 
  LogOut, 
  Plus, 
  Copy, 
  Trash2, 
  ExternalLink,
  BarChart3,
  MousePointerClick,
  Calendar,
  Loader2,
  LinkIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import UrlStatsChart from '@/components/UrlStatsChart';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Dashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { urls, createUrl, deleteUrl, recordClick, isLoading: urlsLoading } = useUrls();
  const [newUrl, setNewUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [expandedUrlId, setExpandedUrlId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const dateLocale = language === 'vi' ? vi : enUS;

  const toggleExpand = (urlId: string) => {
    setExpandedUrlId(expandedUrlId === urlId ? null : urlId);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUrl.trim()) return;

    try {
      new URL(newUrl);
    } catch {
      toast({
        title: t('url.invalidUrl'),
        description: t('url.invalidUrlDesc'),
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    const created = createUrl(newUrl);
    
    if (created) {
      toast({
        title: t('url.createSuccess'),
        description: t('url.createSuccessDesc'),
      });
      setNewUrl('');
    } else {
      toast({
        title: t('common.error'),
        description: t('url.createError'),
        variant: 'destructive',
      });
    }
    
    setIsCreating(false);
  };

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/r/${shortCode}`;
  };

  const handleCopy = (shortCode: string) => {
    navigator.clipboard.writeText(getShortUrl(shortCode));
    toast({
      title: t('url.copied'),
      description: t('url.copiedDesc'),
    });
  };

  const handleVisit = (url: UrlData) => {
    recordClick(url.shortCode);
    window.open(url.originalUrl, '_blank');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      toast({
        title: t('url.deleted'),
        description: t('url.deletedDesc'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('url.deleteError') || 'Failed to delete URL',
        variant: 'destructive',
      });
    }
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {t('dashboard.hello')} <span className="font-medium text-foreground">{user.name}</span>
            </span>
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{urls.length}</p>
                <p className="text-sm text-muted-foreground">{t('dashboard.totalLinks')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
                <p className="text-sm text-muted-foreground">{t('dashboard.totalClicks')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0}
                </p>
                <p className="text-sm text-muted-foreground">{t('dashboard.avgClicks')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create URL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {t('dashboard.createNew')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.createNewDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUrl} className="flex gap-3">
                <Input
                  type="url"
                  placeholder={t('dashboard.urlPlaceholder')}
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isCreating || !newUrl.trim()}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('dashboard.create')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* URL List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>{t('dashboard.yourUrls')}</CardTitle>
              <CardDescription>
                {t('dashboard.yourUrlsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {urlsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : urls.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Link2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{t('dashboard.noUrls')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('dashboard.noUrlsDesc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {urls.map((url, index) => (
                      <motion.div
                        key={url.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <a
                                href={getShortUrl(url.shortCode)}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleVisit(url);
                                }}
                                className="text-primary font-medium hover:underline truncate"
                              >
                                {getShortUrl(url.shortCode)}
                              </a>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {url.originalUrl}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(url.createdAt), 'dd MMM yyyy', { locale: dateLocale })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MousePointerClick className="w-3 h-3" />
                                {url.clicks} {t('dashboard.clicks')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExpand(url.id)}
                              className="hidden sm:flex"
                            >
                              {expandedUrlId === url.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(url.shortCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVisit(url)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(url.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Stats Chart - Expandable */}
                        <AnimatePresence>
                          {expandedUrlId === url.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <UrlStatsChart url={url} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Mobile expand button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(url.id)}
                          className="w-full mt-2 sm:hidden text-muted-foreground"
                        >
                          {expandedUrlId === url.id ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              {t('dashboard.hideStats')}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              {t('dashboard.viewStats')}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
