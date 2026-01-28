import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link2, Zap, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="ghost">{t('auth.login')}</Button>
            </Link>
            <Link to="/register">
              <Button>{t('landing.getStarted')}</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            {t('landing.hero.title')}
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {t('landing.hero.title')},{' '}
            <span className="text-primary">{t('landing.hero.subtitle')}</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('landing.hero.desc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                {t('auth.register')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                {t('auth.hasAccount')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          <div className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('landing.feature1.title')}</h3>
            <p className="text-muted-foreground">
              {t('landing.feature1.desc')}
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-5">
              <BarChart3 className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('landing.feature2.title')}</h3>
            <p className="text-muted-foreground">
              {t('landing.feature2.desc')}
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{t('landing.feature3.title')}</h3>
            <p className="text-muted-foreground">
              {t('landing.feature3.desc')}
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50 mt-16">
        <div className="text-center text-sm text-muted-foreground">
          © 2024 {t('app.name')}.
        </div>
      </footer>
    </div>
  );
};

export default Index;
