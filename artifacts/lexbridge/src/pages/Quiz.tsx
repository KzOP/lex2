import { useState } from "react";
import { useListQuizQuestions, useSubmitQuiz } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function QuizPage() {
  const { data: questions, isLoading } = useListQuizQuestions({ limit: 5 });
  const submitQuiz = useSubmitQuiz();
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any | null>(null);

  const handleSelect = (qId: number, index: number) => {
    setAnswers(prev => ({ ...prev, [qId]: index }));
  };

  const handleSubmit = () => {
    if (!questions) return;
    const submissionAnswers = Object.entries(answers).map(([qId, idx]) => ({
      questionId: Number(qId),
      selectedIndex: idx
    }));
    
    submitQuiz.mutate({ data: { answers: submissionAnswers } }, {
      onSuccess: (data) => setResult(data)
    });
  };

  if (isLoading) return <div className="text-center py-24">جاري تحميل الأسئلة...</div>;

  if (result) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="border-t-4 border-t-primary mb-8">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">النتيجة النهائية</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl font-bold text-black mb-2">{result.score} / {result.total}</div>
            <p className="text-lg text-muted-foreground">لقد أجبت بشكل صحيح على {result.percentage}% من الأسئلة</p>
          </CardContent>
        </Card>

        <h3 className="text-xl font-bold mb-6">تفاصيل الإجابات:</h3>
        <div className="space-y-6">
          {result.details.map((detail: any, i: number) => (
            <Card key={detail.questionId} className={`border-r-4 ${detail.isCorrect ? 'border-r-green-500' : 'border-r-destructive'}`}>
              <CardContent className="pt-6">
                <p className="font-bold mb-4 text-lg">{i + 1}. {detail.questionAr}</p>
                <div className="mb-4 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">إجابتك:</span>
                    <span className={detail.isCorrect ? "text-green-600" : "text-destructive line-through"}>
                      الخيار رقم {detail.selectedIndex + 1}
                    </span>
                  </div>
                  {!detail.isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">الإجابة الصحيحة:</span>
                      <span className="text-green-600">الخيار رقم {detail.correctIndex + 1}</span>
                    </div>
                  )}
                </div>
                <div className="bg-muted p-4 rounded-md text-sm leading-relaxed border border-border">
                  <span className="font-bold block mb-1 text-primary">التوضيح القانوني:</span>
                  {detail.explanationAr}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button onClick={() => window.location.reload()} size="lg" className="px-8">إعادة الاختبار</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">اختبار المعرفة القانونية</h1>
        <p className="text-lg text-muted-foreground">اختبر معلوماتك في الأنظمة السعودية الأساسية</p>
      </div>

      <div className="space-y-8 mb-8">
        {questions?.map((q, i) => (
          <Card key={q.id}>
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-lg leading-relaxed">{i + 1}. {q.questionAr}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup onValueChange={(val) => handleSelect(q.id, parseInt(val))} value={answers[q.id]?.toString()}>
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2 space-x-reverse border border-border p-3 rounded-md hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={optIdx.toString()} id={`q${q.id}-opt${optIdx}`} />
                      <Label htmlFor={`q${q.id}-opt${optIdx}`} className="flex-1 cursor-pointer pr-2 leading-relaxed">{opt}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center sticky bottom-0 py-4 bg-background border-t border-border">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={questions ? Object.keys(answers).length !== questions.length : true || submitQuiz.isPending}
          className="w-full sm:w-auto px-12 text-lg h-14"
        >
          {submitQuiz.isPending ? "جاري الإرسال..." : "إرسال الإجابات"}
        </Button>
      </div>
    </div>
  );
}