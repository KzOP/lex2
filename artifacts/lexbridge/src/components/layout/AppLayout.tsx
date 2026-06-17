import { Link } from "wouter";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans text-foreground" dir="rtl">
      <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-black text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                LexBridge <span className="text-primary font-normal">Saudi</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/systems" className="text-white/80 hover:text-primary transition-colors">الأنظمة</Link>
              <Link href="/compare" className="text-white/80 hover:text-primary transition-colors">المقارنة</Link>
              <Link href="/glossary" className="text-white/80 hover:text-primary transition-colors">القاموس</Link>
              <Link href="/ai-assistant" className="text-white/80 hover:text-primary transition-colors">المساعد الذكي</Link>
              <Link href="/quiz" className="text-white/80 hover:text-primary transition-colors">اختبار المعرفة</Link>
              <Link href="/search" className="text-white/80 hover:text-primary transition-colors">البحث</Link>
              <Link href="/admin" className="text-white/80 hover:text-primary transition-colors">الإدارة</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="border-t border-border bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-white/60">
          <p className="mb-4">المحتوى المعروض لأغراض تعليمية وتوعوية فقط ولا يُعد استشارة قانونية أو رأياً قانونياً ملزماً.</p>
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/about" className="hover:text-primary transition-colors">من نحن</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} LexBridge Saudi. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
