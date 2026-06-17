import { useState } from "react";
import { useListSystems, useCompareSystems } from "@workspace/api-client-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const { data: systems, isLoading } = useListSystems();
  const compareMutation = useCompareSystems();
  const [comparedSystems, setComparedSystems] = useState<any[] | null>(null);

  const toggleSystem = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) return;
    compareMutation.mutate({ data: { ids: selectedIds } }, {
      onSuccess: (data) => setComparedSystems(data)
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">مقارنة الأنظمة</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          اختر نظامين أو ثلاثة للمقارنة بينها في الالتزامات والمخالفات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 border-l border-border pl-6">
          <h2 className="text-xl font-bold mb-4">اختر الأنظمة (أقصى حد 3)</h2>
          {isLoading ? (
            <div>جاري التحميل...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {systems?.map(sys => (
                <div key={sys.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`sys-${sys.id}`} 
                    checked={selectedIds.includes(sys.id)}
                    onCheckedChange={() => toggleSystem(sys.id)}
                    disabled={!selectedIds.includes(sys.id) && selectedIds.length >= 3}
                  />
                  <label htmlFor={`sys-${sys.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {sys.nameAr}
                  </label>
                </div>
              ))}
            </div>
          )}
          <Button 
            className="w-full mt-6 bg-primary text-white hover:bg-primary/90"
            disabled={selectedIds.length < 2 || compareMutation.isPending}
            onClick={handleCompare}
          >
            {compareMutation.isPending ? "جاري المقارنة..." : "مقارنة الأنظمة"}
          </Button>
        </div>

        <div className="md:col-span-3">
          {!comparedSystems ? (
            <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg p-12 text-center">
              اختر الأنظمة من القائمة الجانبية واضغط على زر المقارنة لعرض النتائج هنا
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparedSystems.map(sys => (
                <Card key={sys.id} className="border-t-4 border-t-primary">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>{sys.nameAr}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 divide-y divide-border">
                    <div className="py-4">
                      <h4 className="font-bold text-sm text-primary mb-2">الهدف</h4>
                      <p className="text-sm text-muted-foreground line-clamp-4">{sys.objectiveAr}</p>
                    </div>
                    <div className="py-4">
                      <h4 className="font-bold text-sm text-primary mb-2">الالتزامات</h4>
                      <p className="text-sm text-muted-foreground line-clamp-4">{sys.obligationsAr}</p>
                    </div>
                    <div className="py-4">
                      <h4 className="font-bold text-sm text-primary mb-2">المخالفات</h4>
                      <p className="text-sm text-muted-foreground line-clamp-4">{sys.commonViolationsAr}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}