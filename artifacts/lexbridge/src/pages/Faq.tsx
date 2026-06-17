import { useListFaqItems } from "@workspace/api-client-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FaqPage() {
  const { data: faqs, isLoading } = useListFaqItems();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">الأسئلة الشائعة</h1>
        <p className="text-lg text-muted-foreground">
          إجابات مبسطة للأسئلة القانونية الأكثر شيوعاً
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {faqs?.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id.toString()} className="border border-border mb-4 px-4 rounded-lg bg-white data-[state=open]:border-primary transition-all">
              <AccordionTrigger className="text-right text-lg font-bold hover:no-underline py-4 text-black">
                {faq.questionAr}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4 border-t border-border pt-4 mt-2">
                {faq.answerAr}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}