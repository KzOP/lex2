import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">من نحن</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          نحن منصة سعودية متخصصة في نشر الوعي القانوني بطريقة عصرية ومبسطة، لتمكين الأفراد ورواد الأعمال من فهم الأنظمة والتشريعات.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary border-r-4 border-primary pr-4">رؤيتنا</h2>
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground">
                نسعى لأن نكون المرجع الأول والموثوق للمعرفة القانونية المبسطة في المملكة العربية السعودية، مساهمين في بناء مجتمع واعٍ بحقوقه وواجباته ومتوافق مع التطور التشريعي المتسارع الذي تشهده المملكة وفقاً لرؤية 2030.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary border-r-4 border-primary pr-4">رسالتنا</h2>
          <Card className="border-none shadow-sm bg-muted/30">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-foreground">
                تبسيط المصطلحات والمفاهيم القانونية المعقدة، وتقديمها في قوالب تقنية مبتكرة وتفاعلية، مما يجعل الوصول إلى المعلومة القانونية الدقيقة أمراً سهلاً ومتاحاً للجميع في أي وقت ومن أي مكان.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-primary border-r-4 border-primary pr-4">أهدافنا</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-black text-primary rounded-lg flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="font-bold text-lg mb-2">تعزيز الثقافة القانونية</h3>
                <p className="text-muted-foreground">رفع مستوى الوعي بالأنظمة واللوائح لدى مختلف فئات المجتمع.</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-black text-primary rounded-lg flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="font-bold text-lg mb-2">دعم رواد الأعمال</h3>
                <p className="text-muted-foreground">توفير الدليل الاسترشادي للأنظمة التجارية والعمالية لتجنب المخالفات.</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-black text-primary rounded-lg flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="font-bold text-lg mb-2">تطوير أدوات تفاعلية</h3>
                <p className="text-muted-foreground">استخدام تقنيات الذكاء الاصطناعي لتقديم إجابات سريعة ودقيقة.</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-black text-primary rounded-lg flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h3 className="font-bold text-lg mb-2">مواكبة التشريعات</h3>
                <p className="text-muted-foreground">تحديث مستمر للمعلومات القانونية وفقاً لآخر التعديلات الرسمية.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}