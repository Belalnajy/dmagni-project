'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

type Locale = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.admin': 'Admin',
    'nav.dashboard': 'Dashboard',
    'nav.signin': 'Sign In',
    'nav.contact': 'Contact Us',
    'nav.tryNow': 'Try Now →',

    // Hero
    'hero.badge': 'Powered by Advanced AI Technology',
    'hero.title1': 'See How Clothes Fit',
    'hero.title2': 'Before You Buy',
    'hero.subtitle':
      'Upload your photo and any garment — our AI creates a realistic virtual try-on in seconds. No more guessing, no more returns.',
    'hero.cta': 'Try It Free',
    'hero.learnMore': 'Learn More',
    'hero.stat.tryons': 'Try-Ons',
    'hero.stat.accuracy': 'Accuracy',
    'hero.stat.processing': 'Processing',

    // TryOn
    'tryon.badge': 'AI-Powered Virtual Try-On',
    'tryon.title': 'Try It On in',
    'tryon.titleHighlight': '3 Simple Steps',
    'tryon.subtitle':
      'Upload your photo and a garment image. Our AI will realistically merge them in seconds.',
    'tryon.step1': 'Step 1',
    'tryon.step1.title': 'Your Photo',
    'tryon.step1.desc': 'Drop or click to upload',
    'tryon.step1.done': 'Photo Uploaded',
    'tryon.step2': 'Step 2',
    'tryon.step2.title': 'Garment Photo',
    'tryon.step2.desc': 'Drop or click to upload',
    'tryon.step2.done': 'Garment Uploaded',
    'tryon.step3': 'Step 3',
    'tryon.step3.title': 'Result',
    'tryon.step3.desc': 'Your merged result will appear here',
    'tryon.step3.done': 'AI Generated Result',
    'tryon.format': '.JPG or .PNG',
    'tryon.mergeBtn': 'Merge Now',
    'tryon.uploading': 'Uploading Images...',
    'tryon.processing': 'AI is Processing...',
    'tryon.done': 'Done!',
    'tryon.error': 'Failed — Retrying...',
    'tryon.loginRequired': 'Login Required',
    'tryon.loginRequiredDesc':
      'Please sign in to your account to use our AI Virtual Try-On service.',
    'tryon.loginBtn': 'Sign In to Start',

    // Features
    'features.title': 'Why Choose',
    'features.titleHighlight': 'Dmagni',
    'features.subtitle':
      'Built with cutting-edge technology for the best virtual try-on experience.',
    'features.fast.title': 'Lightning Fast',
    'features.fast.desc':
      'Get your results in under 15 seconds. Our AI pipeline is optimized for speed without sacrificing quality.',
    'features.realistic.title': 'Hyper Realistic',
    'features.realistic.desc':
      "Powered by the IDM-VTON model, results are so realistic you won't believe it's AI-generated.",
    'features.privacy.title': 'Privacy First',
    'features.privacy.desc':
      'Your images are auto-deleted within 24 hours. We never store or share your personal photos.',
    'features.free.title': 'Free to Start',
    'features.free.desc':
      'Get 3 free merges daily. Upgrade to Premium for unlimited access with priority processing.',
    'features.secure.title': 'Secure Backend',
    'features.secure.desc':
      'All AI processing runs server-side. Your API keys and data are never exposed to the client.',
    'features.categories.title': 'Multiple Categories',
    'features.categories.desc':
      'Try on shirts, dresses, jackets, and more. Support for various garment types coming soon.',

    // Pricing
    'pricing.title': 'Simple, Transparent',
    'pricing.titleHighlight': 'Pricing',
    'pricing.subtitle': 'Start free, upgrade when you need more.',
    'pricing.free': 'Free',
    'pricing.free.price': '$0',
    'pricing.free.period': '/ month',
    'pricing.free.desc': 'Perfect for trying it out',
    'pricing.free.f1': '3 merges per day',
    'pricing.free.f2': 'Standard quality',
    'pricing.free.f3': 'JPG & PNG support',
    'pricing.free.f4': 'Auto image deletion',
    'pricing.free.btn': 'Current Plan',
    'pricing.premium': 'Premium',
    'pricing.premium.price': '$9.99',
    'pricing.premium.period': '/ month',
    'pricing.premium.desc': 'For creators and power users',
    'pricing.premium.badge': 'Most Popular',
    'pricing.premium.f1': 'Unlimited merges',
    'pricing.premium.f2': 'High quality output',
    'pricing.premium.f3': 'Priority processing',
    'pricing.premium.f4': 'All garment categories',
    'pricing.premium.f5': 'API access',
    'pricing.premium.f6': 'Email support',
    'pricing.premium.btn': 'Upgrade Now',

    // Footer
    'footer.rights': '© 2026 Dmagni. All rights reserved.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.support': 'Support',

    // Admin
    'admin.title': 'Admin Panel',
    'admin.dashboard': 'Dashboard',
    'admin.users': 'Users',
    'admin.analytics': 'Analytics',
    'admin.billing': 'Billing',
    'admin.settings': 'Settings',
    'admin.signout': 'Sign Out',
    'admin.backToSite': 'Back to Site',
    'admin.systemOnline': 'System Online',
    'admin.allServices': 'All services operational',
    'admin.navigation': 'Navigation',
    'admin.dashboard.title': 'Dashboard',
    'admin.dashboard.subtitle':
      'Track user activity, generation volume, and system health.',
    'admin.totalUsers': 'Total Users',
    'admin.totalGenerations': 'Total Generations',
    'admin.apiCosts': 'API Costs',
    'admin.avgProcessing': 'Avg. Processing',
    'admin.generationVolume': 'Generation Volume',
    'admin.garmentCategories': 'Garment Categories',
    'admin.recentUsers': 'Recent Users',
    'admin.latestRegistrations': 'Latest registrations and activity',
    'admin.viewAll': 'View All →',
    'admin.last7days': 'Last 7 Days',
    'admin.last30days': 'Last 30 Days',
    'admin.thisYear': 'This Year',
    'admin.merges': 'Merges',
    'admin.visitors': 'Visitors',
    'admin.user': 'User',
    'admin.email': 'Email',
    'admin.plan': 'Plan',
    'admin.totalMerges': 'Merges',
    'admin.credits': 'Credits',
    'admin.joined': 'Joined',
    'admin.loading': 'Loading...',
    'admin.messages': 'Messages',

    // Contact
    'contact.title': 'Contact',
    'contact.titleHighlight': 'Us',
    'contact.subtitle':
      'Have a question, feedback, or need help? Reach out to us and our admin team will review it.',
    'contact.sent.title': 'Message Sent!',
    'contact.sent.desc':
      'Thank you for reaching out. Our team will review your message shortly.',
    'contact.sent.btn': 'Send Another Message',
    'contact.form.name': 'Your Name',
    'contact.form.namePlaceholder': 'John Doe',
    'contact.form.email': 'Email Address',
    'contact.form.emailPlaceholder': 'john@example.com',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'How can we help you?',
    'contact.form.sending': 'Sending...',
    'contact.form.send': 'Send Message',
    'contact.back': 'Back to Home',

    // Login
    'login.welcome': 'Welcome Back',
    'login.create': 'Create Account',
    'login.desc.login': 'Enter your email and password to sign in',
    'login.desc.create': 'Sign up to start merging garments',
    'login.fullname': 'Full Name',
    'login.password': 'Password',
    'login.wait': 'Please wait...',
    'login.signin': 'Sign In',
    'login.signup': 'Sign Up',
    'login.toggle.signup': "Don't have an account? Sign up",
    'login.toggle.login': 'Already have an account? Sign in',
    'login.demo':
      "Demo Admin email trick: login/register with 'admin' in email to grant admin role.",

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview':
      'Here is a quick overview of your account and generations.',
    'dashboard.plan': 'Current Plan',
    'dashboard.credits': 'Credits Remaining',
    'dashboard.totalGen': 'Total Generations',
    'dashboard.gallery': 'Your Gallery',
    'dashboard.empty.title': 'No generations yet',
    'dashboard.empty.desc':
      'Try merging some outfits to see your history here.',
    'dashboard.loading': 'Loading your profile...',
    'dashboard.error': 'Error Loading Profile',

    // Messages
    'messages.title': 'Contact Messages',
    'messages.desc': 'Review and manage inquiries from users.',
    'messages.search': 'Search messages...',
    'messages.empty.title': 'No messages found',
    'messages.empty.desc': 'Your inbox is clean and organized.',
  },
  ar: {
    // Navbar
    'nav.features': 'المميزات',
    'nav.howItWorks': 'كيف يعمل',
    'nav.pricing': 'الأسعار',
    'nav.admin': 'لوحة التحكم',
    'nav.dashboard': 'لوحة التحكم',
    'nav.signin': 'تسجيل الدخول',
    'nav.contact': 'تواصل معنا',
    'nav.tryNow': '← جرب الآن',

    // Hero
    'hero.badge': 'مدعوم بتقنية الذكاء الاصطناعي المتقدمة',
    'hero.title1': 'شوف الهدوم عليك',
    'hero.title2': 'قبل ما تشتري',
    'hero.subtitle':
      'ارفع صورتك وصورة الملابس — الذكاء الاصطناعي هيدمجهم بشكل واقعي في ثواني. بدون تخمين، بدون مرتجعات.',
    'hero.cta': 'جرب مجاناً',
    'hero.learnMore': 'اعرف أكتر',
    'hero.stat.tryons': 'عملية دمج',
    'hero.stat.accuracy': 'دقة',
    'hero.stat.processing': 'معالجة',

    // TryOn
    'tryon.badge': 'تجربة ارتداء افتراضية بالذكاء الاصطناعي',
    'tryon.title': 'جربها في',
    'tryon.titleHighlight': '3 خطوات بسيطة',
    'tryon.subtitle':
      'ارفع صورتك الشخصية وصورة للملابس. الذكاء الاصطناعي هيدمجهم في ثواني.',
    'tryon.step1': 'الخطوة 1',
    'tryon.step1.title': 'صورتك الشخصية',
    'tryon.step1.desc': 'اسحب أو اضغط للرفع',
    'tryon.step1.done': 'تم رفع الصورة',
    'tryon.step2': 'الخطوة 2',
    'tryon.step2.title': 'صورة الملابس',
    'tryon.step2.desc': 'اسحب أو اضغط للرفع',
    'tryon.step2.done': 'تم رفع الملابس',
    'tryon.step3': 'الخطوة 3',
    'tryon.step3.title': 'النتيجة',
    'tryon.step3.desc': 'نتيجة الدمج هتظهر هنا',
    'tryon.step3.done': 'نتيجة الذكاء الاصطناعي',
    'tryon.format': '.JPG أو .PNG',
    'tryon.mergeBtn': 'دمج الصور الآن',
    'tryon.uploading': 'جاري رفع الصور...',
    'tryon.processing': 'الذكاء الاصطناعي بيعالج...',
    'tryon.done': 'تم!',
    'tryon.error': 'فشل — بيحاول تاني...',
    'tryon.loginRequired': 'برجاء تسجيل الدخول',
    'tryon.loginRequiredDesc':
      'لازم تسجل دخول عشان تقدر تستخدم خدمة القياس الافتراضي بالذكاء الاصطناعي.',
    'tryon.loginBtn': 'سجل دخول وابدأ الآن',

    // Features
    'features.title': 'ليه تختار',
    'features.titleHighlight': 'دمجني',
    'features.subtitle': 'مبني بأحدث التقنيات لأفضل تجربة ارتداء افتراضية.',
    'features.fast.title': 'سرعة البرق',
    'features.fast.desc':
      'النتائج في أقل من 15 ثانية. خطوط المعالجة محسّنة للسرعة من غير ما تأثر على الجودة.',
    'features.realistic.title': 'واقعية فائقة',
    'features.realistic.desc':
      'بنستخدم نموذج IDM-VTON، النتائج واقعية لدرجة مش هتصدق إنها ذكاء اصطناعي.',
    'features.privacy.title': 'الخصوصية أولاً',
    'features.privacy.desc':
      'صورك بتتحذف تلقائياً خلال 24 ساعة. مش بنخزن أو نشارك صورك الشخصية أبداً.',
    'features.free.title': 'ابدأ مجاناً',
    'features.free.desc':
      'احصل على 3 عمليات دمج يومياً مجاناً. ترقى للبريميوم لاستخدام غير محدود.',
    'features.secure.title': 'خادم آمن',
    'features.secure.desc':
      'كل المعالجة بتتم على السيرفر. مفاتيح الـ API وبياناتك مش بتتكشف أبداً.',
    'features.categories.title': 'فئات متعددة',
    'features.categories.desc':
      'جرب قمصان، فساتين، جاكيتات، وأكتر. دعم أنواع ملابس إضافية قريباً.',

    // Pricing
    'pricing.title': 'أسعار بسيطة',
    'pricing.titleHighlight': 'وشفافة',
    'pricing.subtitle': 'ابدأ مجاناً، ترقى لما تحتاج أكتر.',
    'pricing.free': 'مجاني',
    'pricing.free.price': '$0',
    'pricing.free.period': '/ شهرياً',
    'pricing.free.desc': 'مثالي للتجربة',
    'pricing.free.f1': '3 عمليات دمج يومياً',
    'pricing.free.f2': 'جودة عادية',
    'pricing.free.f3': 'دعم JPG و PNG',
    'pricing.free.f4': 'حذف تلقائي للصور',
    'pricing.free.btn': 'الخطة الحالية',
    'pricing.premium': 'بريميوم',
    'pricing.premium.price': '$9.99',
    'pricing.premium.period': '/ شهرياً',
    'pricing.premium.desc': 'للمبدعين والمستخدمين المتقدمين',
    'pricing.premium.badge': 'الأكثر شعبية',
    'pricing.premium.f1': 'دمج غير محدود',
    'pricing.premium.f2': 'جودة عالية',
    'pricing.premium.f3': 'أولوية في المعالجة',
    'pricing.premium.f4': 'جميع فئات الملابس',
    'pricing.premium.f5': 'وصول للـ API',
    'pricing.premium.f6': 'دعم بالإيميل',
    'pricing.premium.btn': 'ترقى الآن',

    // Footer
    'footer.rights': '© 2026 دمجني. جميع الحقوق محفوظة.',
    'footer.privacy': 'الخصوصية',
    'footer.terms': 'الشروط',
    'footer.support': 'الدعم',

    // Admin
    'admin.title': 'لوحة التحكم',
    'admin.dashboard': 'الرئيسية',
    'admin.users': 'المستخدمين',
    'admin.analytics': 'التحليلات',
    'admin.billing': 'الفواتير',
    'admin.settings': 'الإعدادات',
    'admin.signout': 'تسجيل الخروج',
    'admin.backToSite': 'العودة للموقع',
    'admin.systemOnline': 'النظام يعمل',
    'admin.allServices': 'جميع الخدمات تعمل',
    'admin.navigation': 'التنقل',
    'admin.dashboard.title': 'لوحة المعلومات',
    'admin.dashboard.subtitle':
      'تتبع نشاط المستخدمين، حجم التوليد، وصحة النظام.',
    'admin.totalUsers': 'إجمالي المستخدمين',
    'admin.totalGenerations': 'إجمالي التوليدات',
    'admin.apiCosts': 'تكاليف الـ API',
    'admin.avgProcessing': 'متوسط المعالجة',
    'admin.generationVolume': 'حجم التوليد',
    'admin.garmentCategories': 'فئات الملابس',
    'admin.recentUsers': 'أحدث المستخدمين',
    'admin.latestRegistrations': 'أحدث التسجيلات والنشاط',
    'admin.viewAll': '← عرض الكل',
    'admin.last7days': 'آخر 7 أيام',
    'admin.last30days': 'آخر 30 يوم',
    'admin.thisYear': 'هذه السنة',
    'admin.merges': 'عمليات الدمج',
    'admin.visitors': 'الزوار',
    'admin.user': 'المستخدم',
    'admin.email': 'البريد',
    'admin.plan': 'الخطة',
    'admin.totalMerges': 'الدمج',
    'admin.credits': 'الرصيد',
    'admin.joined': 'تاريخ الانضمام',
    'admin.loading': 'جاري التحميل...',
    'admin.messages': 'الرسائل',

    // Contact
    'contact.title': 'تواصل',
    'contact.titleHighlight': 'معنا',
    'contact.subtitle':
      'عندك سؤال، تعليق، أو محتاج مساعدة؟ تواصل معانا وفريق الدعم هيراجعه.',
    'contact.sent.title': 'تم التوصيل بنجاح!',
    'contact.sent.desc': 'شكرا لتواصلك. فريقنا هيراجع رسالتك في أقرب وقت.',
    'contact.sent.btn': 'إرسال رسالة تانية',
    'contact.form.name': 'الاسم',
    'contact.form.namePlaceholder': 'أحمد محمد',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.emailPlaceholder': 'ahmed@example.com',
    'contact.form.message': 'الرسالة',
    'contact.form.messagePlaceholder': 'تفضل، إزاي نقدر نساعدك؟',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.form.send': 'إرسال الرسالة',
    'contact.back': 'العودة للرئيسية',

    // Login
    'login.welcome': 'مرحباً بيك من تاني',
    'login.create': 'إنشاء حساب جديد',
    'login.desc.login': 'أدخل الإيميل والباسورد عشان تسجل دخول',
    'login.desc.create': 'اعمل حساب جديد عشان تبدأ تدمج الهدوم',
    'login.fullname': 'الاسم بالكامل',
    'login.password': 'كلمة المرور',
    'login.wait': 'برجاء الانتظار...',
    'login.signin': 'تسجيل الدخول',
    'login.signup': 'إنشاء حساب',
    'login.toggle.signup': 'معندكش حساب؟ سجل دلوقتي',
    'login.toggle.login': 'عندك حساب بالفعل؟ سجل دخول',
    'login.demo':
      "تلميح للأدمن: سجل أو ادخل بإيميل فيه كلمة 'admin' هيخليك أدمن تلقائي.",

    // Dashboard
    'dashboard.welcome': 'مرحباً بيك',
    'dashboard.overview': 'دي نظرة سريعة على حسابك والصور اللي عملتها.',
    'dashboard.plan': 'الخطة الحالية',
    'dashboard.credits': 'الرصيد المتبقي',
    'dashboard.totalGen': 'إجمالي الصور',
    'dashboard.gallery': 'معرض الصور المعالجة',
    'dashboard.empty.title': 'مفيش صور لسة',
    'dashboard.empty.desc': 'جرب تدمج شوية هدوم ومظهرك هيتحفظ هنا.',
    'dashboard.loading': 'جاري تحميل البروفايل...',
    'dashboard.error': 'خطأ في التحميل',

    // Messages
    'messages.title': 'رسائل التواصل',
    'messages.desc': 'راجع ودير استفسارات المستخدمين.',
    'messages.search': 'ابحث في الرسائل...',
    'messages.empty.title': 'صندوق الوارد فارغ',
    'messages.empty.desc': 'ومفيش رسايل جديدة في الوقت الحالي.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  dir: 'ltr',
  setLocale: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('dmagni-locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('dmagni-locale', newLocale);
  }, []);

  const dir: Direction = locale === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback(
    (key: string): string => {
      return translations[locale]?.[key] || key;
    },
    [locale],
  );

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [dir, locale]);

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
