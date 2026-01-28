import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

export const translations: Translations = {
  // Common
  'app.name': { vi: 'ShortLink', en: 'ShortLink' },
  'common.loading': { vi: 'Đang tải...', en: 'Loading...' },
  'common.error': { vi: 'Lỗi', en: 'Error' },
  'common.success': { vi: 'Thành công', en: 'Success' },
  
  // Auth
  'auth.login': { vi: 'Đăng nhập', en: 'Login' },
  'auth.register': { vi: 'Đăng ký', en: 'Register' },
  'auth.logout': { vi: 'Đăng xuất', en: 'Logout' },
  'auth.email': { vi: 'Email', en: 'Email' },
  'auth.password': { vi: 'Mật khẩu', en: 'Password' },
  'auth.confirmPassword': { vi: 'Xác nhận mật khẩu', en: 'Confirm Password' },
  'auth.name': { vi: 'Họ và tên', en: 'Full Name' },
  'auth.noAccount': { vi: 'Chưa có tài khoản?', en: "Don't have an account?" },
  'auth.hasAccount': { vi: 'Đã có tài khoản?', en: 'Already have an account?' },
  'auth.loginTitle': { vi: 'Đăng nhập vào tài khoản', en: 'Login to your account' },
  'auth.loginDesc': { vi: 'Nhập thông tin đăng nhập của bạn', en: 'Enter your credentials' },
  'auth.registerTitle': { vi: 'Tạo tài khoản mới', en: 'Create a new account' },
  'auth.registerDesc': { vi: 'Điền thông tin để đăng ký', en: 'Fill in your information to register' },
  'auth.loginSuccess': { vi: 'Đăng nhập thành công!', en: 'Login successful!' },
  'auth.welcomeBack': { vi: 'Chào mừng bạn quay trở lại.', en: 'Welcome back.' },
  'auth.registerSuccess': { vi: 'Đăng ký thành công!', en: 'Registration successful!' },
  'auth.accountCreated': { vi: 'Tài khoản của bạn đã được tạo.', en: 'Your account has been created.' },
  'auth.invalidCredentials': { vi: 'Email hoặc mật khẩu không đúng.', en: 'Invalid email or password.' },
  'auth.emailExists': { vi: 'Email này đã được sử dụng.', en: 'This email is already in use.' },
  'auth.passwordMismatch': { vi: 'Mật khẩu xác nhận không khớp.', en: 'Passwords do not match.' },
  'auth.fillAllFields': { vi: 'Vui lòng điền đầy đủ thông tin.', en: 'Please fill in all fields.' },
  
  // Landing
  'landing.hero.title': { vi: 'Rút gọn URL', en: 'Shorten URLs' },
  'landing.hero.subtitle': { vi: 'Đơn giản & Hiệu quả', en: 'Simple & Effective' },
  'landing.hero.desc': { vi: 'Biến những URL dài thành link ngắn gọn, dễ chia sẻ và theo dõi thống kê chi tiết.', en: 'Transform long URLs into short, easy-to-share links and track detailed statistics.' },
  'landing.getStarted': { vi: 'Bắt đầu ngay', en: 'Get Started' },
  'landing.feature1.title': { vi: 'Rút gọn nhanh chóng', en: 'Quick Shortening' },
  'landing.feature1.desc': { vi: 'Tạo link rút gọn chỉ trong vài giây', en: 'Create short links in seconds' },
  'landing.feature2.title': { vi: 'Thống kê chi tiết', en: 'Detailed Statistics' },
  'landing.feature2.desc': { vi: 'Theo dõi lượt click theo thời gian thực', en: 'Track clicks in real-time' },
  'landing.feature3.title': { vi: 'Bảo mật cao', en: 'High Security' },
  'landing.feature3.desc': { vi: 'Dữ liệu được mã hóa và bảo vệ', en: 'Data is encrypted and protected' },
  
  // Dashboard
  'dashboard.hello': { vi: 'Xin chào,', en: 'Hello,' },
  'dashboard.totalLinks': { vi: 'Tổng số link', en: 'Total Links' },
  'dashboard.totalClicks': { vi: 'Tổng lượt click', en: 'Total Clicks' },
  'dashboard.avgClicks': { vi: 'Trung bình click/link', en: 'Avg Clicks/Link' },
  'dashboard.createNew': { vi: 'Tạo URL rút gọn mới', en: 'Create New Short URL' },
  'dashboard.createNewDesc': { vi: 'Nhập URL bạn muốn rút gọn bên dưới', en: 'Enter the URL you want to shorten below' },
  'dashboard.create': { vi: 'Tạo', en: 'Create' },
  'dashboard.yourUrls': { vi: 'Danh sách URL của bạn', en: 'Your URLs' },
  'dashboard.yourUrlsDesc': { vi: 'Quản lý và theo dõi các URL đã rút gọn', en: 'Manage and track your shortened URLs' },
  'dashboard.noUrls': { vi: 'Chưa có URL nào được tạo', en: 'No URLs created yet' },
  'dashboard.noUrlsDesc': { vi: 'Hãy tạo URL rút gọn đầu tiên của bạn!', en: 'Create your first short URL!' },
  'dashboard.clicks': { vi: 'lượt click', en: 'clicks' },
  'dashboard.hideStats': { vi: 'Ẩn thống kê', en: 'Hide Statistics' },
  'dashboard.viewStats': { vi: 'Xem thống kê', en: 'View Statistics' },
  'dashboard.urlPlaceholder': { vi: 'https://example.com/your-long-url-here', en: 'https://example.com/your-long-url-here' },
  
  // URL operations
  'url.invalidUrl': { vi: 'URL không hợp lệ', en: 'Invalid URL' },
  'url.invalidUrlDesc': { vi: 'Vui lòng nhập một URL đầy đủ (bao gồm http:// hoặc https://)', en: 'Please enter a complete URL (including http:// or https://)' },
  'url.createSuccess': { vi: 'Tạo thành công!', en: 'Created successfully!' },
  'url.createSuccessDesc': { vi: 'URL đã được rút gọn.', en: 'URL has been shortened.' },
  'url.createError': { vi: 'Không thể tạo URL rút gọn.', en: 'Could not create short URL.' },
  'url.copied': { vi: 'Đã sao chép!', en: 'Copied!' },
  'url.copiedDesc': { vi: 'URL đã được sao chép vào clipboard.', en: 'URL has been copied to clipboard.' },
  'url.deleted': { vi: 'Đã xóa', en: 'Deleted' },
  'url.deletedDesc': { vi: 'URL đã được xóa khỏi danh sách.', en: 'URL has been removed from the list.' },
  
  // Stats Chart
  'stats.title': { vi: 'Thống kê lượt click', en: 'Click Statistics' },
  'stats.7days': { vi: '7 ngày', en: '7 days' },
  'stats.4weeks': { vi: '4 tuần', en: '4 weeks' },
  
  // Not Found
  'notFound.title': { vi: 'Không tìm thấy trang', en: 'Page Not Found' },
  'notFound.desc': { vi: 'Trang bạn tìm kiếm không tồn tại.', en: 'The page you are looking for does not exist.' },
  'notFound.backHome': { vi: 'Về trang chủ', en: 'Back to Home' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
