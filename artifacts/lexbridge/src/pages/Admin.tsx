import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useListSystems, useDeleteSystem, useCreateSystem, useListFaqItems, useDeleteFaqItem, useListLegalTerms, useDeleteLegalTerm } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { data: systems, refetch: refetchSystems } = useListSystems();
  const { data: faqs, refetch: refetchFaqs } = useListFaqItems();
  const { data: terms, refetch: refetchTerms } = useListLegalTerms();
  
  const deleteSystem = useDeleteSystem();
  const deleteFaq = useDeleteFaqItem();
  const deleteTerm = useDeleteLegalTerm();
  const { toast } = useToast();

  const handleDeleteSystem = (id: number) => {
    if(confirm("هل أنت متأكد من حذف هذا النظام؟")) {
      deleteSystem.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          refetchSystems();
        }
      });
    }
  };

  const handleDeleteFaq = (id: number) => {
    if(confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      deleteFaq.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          refetchFaqs();
        }
      });
    }
  };

  const handleDeleteTerm = (id: number) => {
    if(confirm("هل أنت متأكد من حذف هذا المصطلح؟")) {
      deleteTerm.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "تم الحذف بنجاح" });
          refetchTerms();
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black mb-2">لوحة الإدارة</h1>
        <p className="text-muted-foreground">إدارة محتوى منصة LexBridge</p>
      </div>

      <Tabs defaultValue="systems" className="w-full">
        <TabsList className="mb-8 w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0">
          <TabsTrigger value="systems" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">الأنظمة</TabsTrigger>
          <TabsTrigger value="terms" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">المصطلحات</TabsTrigger>
          <TabsTrigger value="faq" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">الأسئلة الشائعة</TabsTrigger>
        </TabsList>

        <TabsContent value="systems">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">إدارة الأنظمة القانونية</CardTitle>
              <Button>إضافة نظام جديد</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">آخر تحديث</TableHead>
                    <TableHead className="text-center w-[150px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systems?.map((sys) => (
                    <TableRow key={sys.id}>
                      <TableCell className="font-medium">{sys.nameAr}</TableCell>
                      <TableCell>{sys.category}</TableCell>
                      <TableCell>{new Date(sys.lastUpdated).toLocaleDateString('ar-SA')}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" size="sm" className="h-8">تعديل</Button>
                          <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDeleteSystem(sys.id)}>حذف</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">إدارة القاموس</CardTitle>
              <Button>إضافة مصطلح</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-1/4">المصطلح (عربي)</TableHead>
                    <TableHead className="text-right w-1/4">المصطلح (إنجليزي)</TableHead>
                    <TableHead className="text-right">التعريف</TableHead>
                    <TableHead className="text-center w-[150px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {terms?.map((term) => (
                    <TableRow key={term.id}>
                      <TableCell className="font-medium">{term.termAr}</TableCell>
                      <TableCell dir="ltr" className="text-right">{term.termEn}</TableCell>
                      <TableCell className="truncate max-w-md">{term.definitionAr}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" size="sm" className="h-8">تعديل</Button>
                          <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDeleteTerm(term.id)}>حذف</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">إدارة الأسئلة الشائعة</CardTitle>
              <Button>إضافة سؤال</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right w-1/3">السؤال</TableHead>
                    <TableHead className="text-right">الإجابة</TableHead>
                    <TableHead className="text-center w-[150px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs?.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium">{faq.questionAr}</TableCell>
                      <TableCell className="truncate max-w-md">{faq.answerAr}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" size="sm" className="h-8">تعديل</Button>
                          <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDeleteFaq(faq.id)}>حذف</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}