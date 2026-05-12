import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import Home from "./pages/Home";
import { Layout } from "./components/Layout";
import { GlowCursor } from "./components/GlowCursor";
import { useLanguage } from "./hooks/useLanguage";

const queryClient = new QueryClient();

function AppContent() {
  const { direction } = useLanguage();

  useEffect(() => {
    // document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('dark');
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <>
      {/* <GlowCursor /> */}
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <HashRouter>
          <AppContent />
        </HashRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;