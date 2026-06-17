import { useState, useRef, useEffect } from "react";
import { useAiChat } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@workspace/api-client-react";

interface AiSource {
  type: string;
  label: string;
  reference?: string;
}

interface MessageEntry {
  msg: ChatMessage;
  sources?: AiSource[];
  hasContext?: boolean;
}

export default function AiAssistantPage() {
  const [entries, setEntries] = useState<MessageEntry[]>([
    {
      msg: {
        role: "assistant",
        content:
          "أهلاً بك في المساعد الذكي لمنصة LexBridge Saudi.\n\nأنا مساعد توعوي قانوني مدعوم بالذكاء الاصطناعي، أجيب بناءً على محتوى قاعدة بيانات المنصة الموثق فقط — لا أخترع معلومات قانونية.\n\nاسألني عن: سوق المال، نظام الشركات، Fintech، أو حماية البيانات الشخصية (PDPL).",
      },
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAiChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, chatMutation.isPending]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userEntry: MessageEntry = { msg: { role: "user", content: input } };
    const history = entries.map((e) => e.msg);
    const newEntries = [...entries, userEntry];
    setEntries(newEntries);
    setInput("");

    chatMutation.mutate(
      { data: { message: input, conversationHistory: history } },
      {
        onSuccess: (data) => {
          const assistantEntry: MessageEntry = {
            msg: { role: "assistant", content: data.response },
            sources: data.sources ?? [],
            hasContext: data.hasContext,
          };
          setEntries([...newEntries, assistantEntry]);
        },
        onError: () => {
          setEntries([
            ...newEntries,
            {
              msg: {
                role: "assistant",
                content: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
              },
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl flex flex-col h-[calc(100vh-16rem)]">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">المساعد الذكي القانوني</h1>
        <p className="text-muted-foreground text-sm">
          يجيب بناءً على محتوى المنصة الموثق فقط — مع ذكر المصدر عند كل إجابة
        </p>
      </div>

      <div className="flex-1 border border-border bg-white overflow-hidden flex flex-col shadow-sm">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-5">
            {entries.map((entry, i) => (
              <div key={i}>
                <div className={`flex ${entry.msg.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[82%] p-4 ${
                      entry.msg.role === "user"
                        ? "bg-black text-white rounded-lg rounded-tr-none"
                        : "bg-muted text-foreground border border-border rounded-lg rounded-tl-none"
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1 font-bold">
                      {entry.msg.role === "user" ? "أنت" : "المساعد الذكي"}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">
                      {entry.msg.content}
                    </div>
                  </div>
                </div>

                {entry.msg.role === "assistant" && entry.sources && entry.sources.length > 0 && (
                  <div className="flex justify-end mt-2">
                    <div className="max-w-[82%] px-3 py-2 bg-primary/5 border border-primary/20 rounded text-xs">
                      <p className="font-bold text-primary mb-1.5">📚 المصادر المُستشهد بها:</p>
                      <ul className="flex flex-col gap-1">
                        {entry.sources.map((s, si) => (
                          <li key={si} className="flex items-start gap-1.5 text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            <span>
                              {s.label}
                              {s.reference && (
                                <span className="mr-1 text-black/50">— {s.reference}</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {entry.msg.role === "assistant" &&
                  entry.hasContext === false &&
                  entry.sources !== undefined && (
                    <div className="flex justify-end mt-2">
                      <div className="max-w-[82%] px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        ⚠️ لم يُعثر على معلومات موثقة في قاعدة بيانات المنصة لهذا السؤال.
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex justify-end">
                <div className="bg-muted border border-border rounded-lg rounded-tl-none p-4">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-gray-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل عن أي نظام قانوني سعودي..."
              className="flex-1 border-gray-300 focus-visible:ring-primary h-12"
              disabled={chatMutation.isPending}
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6"
              disabled={chatMutation.isPending || !input.trim()}
            >
              إرسال
            </Button>
          </form>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            المحتوى لأغراض توعوية فقط • يُستشهد فقط بمحتوى قاعدة بيانات المنصة
          </p>
        </div>
      </div>
    </div>
  );
}
