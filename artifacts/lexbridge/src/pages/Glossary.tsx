import { useState } from "react";
import { useListLegalTerms, getListLegalTermsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const { data: terms, isLoading } = useListLegalTerms(
    { search: search || null, letter },
    { query: { queryKey: getListLegalTermsQueryKey({ search: search || null, letter }) } }
  );

  const arabicLetters = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">القاموس القانوني</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          ابحث عن المصطلحات القانونية ومعانيها في الأنظمة السعودية
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <Input 
          type="search" 
          placeholder="ابحث عن مصطلح..." 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLetter(null); }}
          className="text-lg py-6"
        />
      </div>

      <div className="flex flex-wrap gap-1 justify-center mb-12" dir="rtl">
        <Button 
          variant={letter === null && !search ? "default" : "outline"} 
          size="sm" 
          onClick={() => { setLetter(null); setSearch(""); }}
          className="h-8 w-8 p-0"
        >
          الكل
        </Button>
        {arabicLetters.map(l => (
          <Button 
            key={l}
            variant={letter === l ? "default" : "ghost"} 
            size="sm"
            onClick={() => { setLetter(l); setSearch(""); }}
            className="h-8 w-8 p-0 border border-border/50"
          >
            {l}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : terms?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">لا توجد مصطلحات مطابقة</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {terms?.map(term => (
            <Card key={term.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="flex justify-between items-center text-lg">
                  <span className="text-black">{term.termAr}</span>
                  <span className="text-xs font-normal text-muted-foreground font-mono" dir="ltr">{term.termEn}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {term.definitionAr}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}