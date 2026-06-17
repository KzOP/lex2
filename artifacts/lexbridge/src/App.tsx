import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import HomePage from "@/pages/Home";
import SystemsPage from "@/pages/Systems";
import SystemDetail from "@/pages/SystemDetail";
import ComparePage from "@/pages/Compare";
import AiAssistantPage from "@/pages/AiAssistant";
import GlossaryPage from "@/pages/Glossary";
import FaqPage from "@/pages/Faq";
import QuizPage from "@/pages/Quiz";
import AboutPage from "@/pages/About";
import ContactPage from "@/pages/Contact";
import AdminPage from "@/pages/Admin";
import SearchPage from "@/pages/Search";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/systems" component={SystemsPage} />
        <Route path="/systems/:id" component={SystemDetail} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/ai-assistant" component={AiAssistantPage} />
        <Route path="/glossary" component={GlossaryPage} />
        <Route path="/faq" component={FaqPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/search" component={SearchPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
