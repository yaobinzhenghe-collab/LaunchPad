import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AiAssistant } from "@/components/AiAssistant";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Templates from "@/pages/Templates";
import Tips from "@/pages/Tips";
import Generator from "@/pages/Generator";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import TemplateDetail from "@/pages/TemplateDetail";
import TipDetail from "@/pages/TipDetail";
import FAQ from "@/pages/FAQ";
import AdminInbox from "@/pages/AdminInbox";
import GlobalChat from "@/pages/GlobalChat";
import Submit from "@/pages/Submit";
import AdminModeration from "@/pages/AdminModeration";
import Feed from "@/pages/Feed";
import About from "@/pages/About";
import SDG from "@/pages/SDG";
import Services from "@/pages/Services";
import Innovation from "@/pages/Innovation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/templates" component={Templates} />
      <Route path="/templates/:id" component={TemplateDetail} />
      <Route path="/tips" component={Tips} />
      <Route path="/tips/:id" component={TipDetail} />
      <Route path="/generator" component={Generator} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/chat" component={GlobalChat} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/inbox" component={AdminInbox} />
      <Route path="/admin/moderation" component={AdminModeration} />
      <Route path="/submit" component={Submit} />
      <Route path="/feed" component={Feed} />
      <Route path="/about" component={About} />
      <Route path="/sdg" component={SDG} />
      <Route path="/services" component={Services} />
      <Route path="/innovation" component={Innovation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
          <Navigation />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <AiAssistant />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
