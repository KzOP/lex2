import { useState } from "react";
import { useGlobalSearch, getGlobalSearchQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

const TYPE_LABELS: Record<string, string> = {
  system: "نظام",
  article: "مقالة",
  term: "مصطلح",
  faq: "سؤال شائع",
};

const TYPE_COLORS: Record<string, string> = {
  system: "bg-black text-white",
  article: "bg-primary text-black",
  term: "border border-primary text-black",
  faq: "border border-border text-black",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const enabled = trimmed.length >= 2;

  const { data, isLoading, isFetching } = useGlobalSearch(
    { q: trimmed || "." },
    {
      query: {
        enabled,
        staleTime: 30_000,
        queryKey: getGlobalSearchQueryKey({ q: trimmed || "." }),
      },
    }
  );

  const total = data?.total ?? 0;
  const allResults = [
    ...(data?.systems ?? []),
    ...(data?.articles ?? []),
    ...(data?.terms ?? []),
    ...(data?.faq ?? []),
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">البحث الشامل</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          ابحث في الأنظمة والمصطلحات والمقالات والأسئلة الشائعة دفعةً واحدة
        </p>
      </div>

      <div className="relative mb-8">
        <Input
          type="search"
          placeholder="اكتب للبحث... (حرفان على الأقل)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg py-6 border-2 border-border focus-visible:border-primary focus-visible:ring-0"
          autoFocus
        />
        {isFetching && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {enabled && !isLoading && data && (
        <div className="mb-6 flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
          <span>
            {total > 0 ? (
              <>وجدنا <span className="font-bold text-black">{total}</span> نتيجة</>
            ) : (
              "لا توجد نتائج مطابقة"
            )}
          </span>
          {total > 0 && (
            <div className="flex gap-2 flex-wrap">
              {data.systems.length > 0 && <span className="px-2 py-0.5 rounded-full bg-black text-white text-xs">{data.systems.length} أنظمة</span>}
              {data.articles.length > 0 && <span className="px-2 py-0.5 rounded-full bg-primary text-black text-xs">{data.articles.length} مقالات</span>}
              {data.terms.length > 0 && <span className="px-2 py-0.5 rounded-full border border-primary text-black text-xs">{data.terms.length} مصطلحات</span>}
              {data.faq.length > 0 && <span className="px-2 py-0.5 rounded-full border border-border text-black text-xs">{data.faq.length} أسئلة</span>}
            </div>
          )}
        </div>
      )}

      {isLoading && enabled && (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!enabled && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">🔍</p>
          <p>ابدأ الكتابة للبحث في محتوى المنصة</p>
        </div>
      )}

      {enabled && !isLoading && allResults.length > 0 && (
        <div className="flex flex-col gap-3">
          {allResults.map((item) => (
            <Link key={`${item.type}-${item.id}`} href={item.url}>
              <div className="border border-border p-5 hover:border-primary hover:shadow-sm transition-all cursor-pointer bg-white group">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-base text-black group-hover:text-primary transition-colors leading-snug">
                    {item.titleAr}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 whitespace-nowrap shrink-0 font-medium ${TYPE_COLORS[item.type] ?? ""}`}>
                    {TYPE_LABELS[item.type] ?? item.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.snippetAr}</p>
                {item.systemNameAr && (
                  <p className="text-xs text-primary mt-2">{item.systemNameAr}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {enabled && !isLoading && total === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-muted-foreground mb-2">لا توجد نتائج لـ «{trimmed}»</p>
          <p className="text-sm text-muted-foreground">
            جرّب كلمات أخرى أو تصفّح{" "}
            <Link href="/glossary" className="text-primary hover:underline">القاموس القانوني</Link>
          </p>
        </div>
      )}
    </div>
  );
}
