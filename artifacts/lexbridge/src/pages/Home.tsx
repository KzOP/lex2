import React from "react";
import { Link } from "wouter";
import { useGetSystemsStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: stats, isLoading } = useGetSystemsStats();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            المعرفة القانونية السعودية <br />
            <span className="text-primary">مبسطة ومتاحة للجميع</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            منصة متخصصة لتبسيط الأنظمة واللوائح السعودية. صُممت لتكون مرجعك الموثوق لفهم حقوقك والتزاماتك بطريقة واضحة وعصرية.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/systems">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-none">
                استكشف الأنظمة
              </Button>
            </Link>
            <Link href="/ai-assistant">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 rounded-none bg-transparent">
                تحدث مع المساعد الذكي
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-x-reverse divide-border">
              <div>
                <p className="text-4xl font-bold text-black mb-2">{stats.totalSystems}</p>
                <p className="text-muted-foreground font-medium">أنظمة وتشريعات</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-black mb-2">{stats.totalArticles}</p>
                <p className="text-muted-foreground font-medium">مواد قانونية</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-black mb-2">{stats.totalTerms}</p>
                <p className="text-muted-foreground font-medium">مصطلحات قانونية</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-black mb-2">{stats.totalFaq}</p>
                <p className="text-muted-foreground font-medium">أسئلة شائعة</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Features preview would go here */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-12">أدوات مصممة لخدمتك</h2>
           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             <div className="p-8 bg-white border border-border hover:border-primary transition-colors">
               <h3 className="text-xl font-bold mb-4 text-primary">مقارنة الأنظمة</h3>
               <p className="text-muted-foreground mb-6">قارن بين نظامين أو أكثر لمعرفة الفروقات والتقاطعات بسهولة.</p>
               <Link href="/compare" className="text-black font-semibold hover:text-primary transition-colors">جرب المقارنة ←</Link>
             </div>
             <div className="p-8 bg-black text-white border border-black hover:border-primary transition-colors">
               <h3 className="text-xl font-bold mb-4 text-primary">المساعد الذكي</h3>
               <p className="text-white/70 mb-6">اسأل عن أي نظام قانوني وسيجيبك المساعد المدعوم بالذكاء الاصطناعي.</p>
               <Link href="/ai-assistant" className="text-white font-semibold hover:text-primary transition-colors">تحدث الآن ←</Link>
             </div>
             <div className="p-8 bg-white border border-border hover:border-primary transition-colors">
               <h3 className="text-xl font-bold mb-4 text-primary">اختبار المعرفة</h3>
               <p className="text-muted-foreground mb-6">اختبر معلوماتك القانونية في مجالات مختلفة وتعرف على مستواك.</p>
               <Link href="/quiz" className="text-black font-semibold hover:text-primary transition-colors">ابدأ الاختبار ←</Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
