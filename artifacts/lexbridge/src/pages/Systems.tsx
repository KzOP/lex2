import { useState } from "react";
import { Link } from "wouter";
import { useListSystems, getListSystemsQueryKey } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemsPage() {
  const [category, setCategory] = useState<string | null>(null);
  
  const { data: systems, isLoading } = useListSystems(
    { category },
    { query: { queryKey: getListSystemsQueryKey({ category }) } }
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">الأنظمة القانونية</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          تصفح جميع الأنظمة والتشريعات السعودية المتاحة في المنصة
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button 
          variant={category === null ? "default" : "outline"} 
          onClick={() => setCategory(null)}
          className="rounded-full"
        >
          الكل
        </Button>
        <Button 
          variant={category === "commercial" ? "default" : "outline"} 
          onClick={() => setCategory("commercial")}
          className="rounded-full"
        >
          تجاري
        </Button>
        <Button 
          variant={category === "civil" ? "default" : "outline"} 
          onClick={() => setCategory("civil")}
          className="rounded-full"
        >
          مدني
        </Button>
        <Button 
          variant={category === "labor" ? "default" : "outline"} 
          onClick={() => setCategory("labor")}
          className="rounded-full"
        >
          عمل
        </Button>
        <Button 
          variant={category === "penal" ? "default" : "outline"} 
          onClick={() => setCategory("penal")}
          className="rounded-full"
        >
          جزائي
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse bg-muted/50 border-border h-64" />
          ))}
        </div>
      ) : systems?.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          لا توجد أنظمة مطابقة للبحث
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems?.map((sys) => (
            <Card key={sys.id} className="hover:border-primary transition-colors flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-lg bg-black text-primary flex items-center justify-center text-2xl font-bold">
                    {sys.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sys.nameAr}</CardTitle>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-sm mt-1 inline-block">
                      {sys.category}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {sys.descriptionAr}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border mt-auto">
                <Link href={`/systems/${sys.id}`} className="w-full">
                  <Button variant="outline" className="w-full hover:bg-black hover:text-white hover:border-black transition-colors">
                    قراءة التفاصيل
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}