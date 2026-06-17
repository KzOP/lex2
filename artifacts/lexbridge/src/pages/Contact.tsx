import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال رسالتك بنجاح",
      description: "سنتواصل معك في أقرب وقت ممكن.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">تواصل معنا</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          نحن هنا للإجابة على استفساراتك واقتراحاتك لتطوير المنصة.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="border-none shadow-sm bg-black text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">معلومات التواصل</CardTitle>
            <CardDescription className="text-white/70">
              نسعد بتواصلك معنا عبر القنوات التالية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                <span>📍</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">العنوان</h3>
                <p className="text-white/70">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                <span>✉️</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
                <p className="text-white/70" dir="ltr">info@lexbridge.sa</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                <span>📞</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">الهاتف</h3>
                <p className="text-white/70" dir="ltr">+966 50 000 0000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">أرسل رسالة</CardTitle>
            <CardDescription>
              يرجى تعبئة النموذج أدناه وسنقوم بالرد عليك في أقرب وقت.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" required placeholder="أدخل اسمك الكريم" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" required placeholder="example@domain.com" className="h-12 text-right" dir="ltr" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input id="subject" required placeholder="موضوع الرسالة" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">نص الرسالة</Label>
                <Textarea id="message" required placeholder="اكتب رسالتك هنا..." className="min-h-[150px] resize-none" />
              </div>
              
              <Button type="submit" className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                إرسال
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}