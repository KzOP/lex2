import { useParams } from "wouter";
import { useGetSystem, getGetSystemQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  const { data: system, isLoading } = useGetSystem(id, { 
    query: { enabled: !!id, queryKey: getGetSystemQueryKey(id) } 
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center">جاري التحميل...</div>;
  }

  if (!system) {
    return <div className="container mx-auto px-4 py-24 text-center">لم يتم العثور على النظام</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-black text-primary flex items-center justify-center text-3xl font-bold rounded-lg">
            {system.icon}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black">{system.nameAr}</h1>
            <div className="flex gap-2 mt-2">
              <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded">{system.category}</span>
              <span className="text-sm bg-muted text-muted-foreground px-2 py-1 rounded">آخر تحديث: {new Date(system.lastUpdated).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>
        <p className="text-xl text-muted-foreground mt-6 leading-relaxed max-w-4xl">
          {system.descriptionAr}
        </p>
      </div>

      <Tabs defaultValue="objective" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none h-auto bg-transparent p-0 overflow-x-auto overflow-y-hidden">
          <TabsTrigger value="objective" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3 text-base">الهدف</TabsTrigger>
          <TabsTrigger value="obligations" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3 text-base">الالتزامات</TabsTrigger>
          <TabsTrigger value="violations" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3 text-base">المخالفات الشائعة</TabsTrigger>
          <TabsTrigger value="penalties" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3 text-base">العقوبات</TabsTrigger>
          <TabsTrigger value="tips" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3 text-base">نصائح للامتثال</TabsTrigger>
        </TabsList>
        <div className="mt-8">
          <TabsContent value="objective">
            <Card>
              <CardContent className="pt-6">
                <div className="prose rtl prose-lg max-w-none text-foreground whitespace-pre-line">
                  {system.objectiveAr}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="obligations">
            <Card>
              <CardContent className="pt-6">
                <div className="prose rtl prose-lg max-w-none text-foreground whitespace-pre-line">
                  {system.obligationsAr}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="violations">
            <Card>
              <CardContent className="pt-6">
                <div className="prose rtl prose-lg max-w-none text-foreground whitespace-pre-line">
                  {system.commonViolationsAr}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="penalties">
            <Card>
              <CardContent className="pt-6">
                <div className="prose rtl prose-lg max-w-none text-foreground whitespace-pre-line">
                  {system.penaltiesAr}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tips">
            <Card>
              <CardContent className="pt-6">
                <div className="prose rtl prose-lg max-w-none text-foreground whitespace-pre-line">
                  {system.complianceTipsAr}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-12 flex justify-between border-t border-border pt-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">المرجع الرسمي</p>
          <p className="font-medium">{system.officialReference}</p>
        </div>
        <a href={system.sourceUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            الاطلاع على المصدر الرسمي
          </Button>
        </a>
      </div>
    </div>
  );
}