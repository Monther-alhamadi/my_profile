import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import Home from "./pages/Home";
import NotFound from "./pages/not-found/Index";
import ProjectDetail from "./pages/ProjectDetail";
import CV from "./pages/CV";
import Links from "./pages/Links";
import Dashboard from "./pages/Dashboard";
import DashboardLogin from "./pages/DashboardLogin";
import Assistant from "./pages/Assistant";
import { Layout } from "./components/Layout";
import { GlowCursor } from "./components/GlowCursor";
import { AuthProvider } from "./hooks/useAuth";
import { useLanguage } from "./hooks/useLanguage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      gcTime: 30 * 60 * 1000,
    },
  },
});

function AppContent() {
  const { direction } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/links" element={<Links />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/login" element={<DashboardLogin />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <Toaster />
          <Sonner />
          <HashRouter>
            <AppContent />
          </HashRouter>
        </MotionConfig>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;