import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import NotFound from "./pages/not-found/Index";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hooks/useAuth";
import { useLanguage } from "./hooks/useLanguage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const CV = lazy(() => import("./pages/CV"));
const Links = lazy(() => import("./pages/Links"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardLogin = lazy(() => import("./pages/DashboardLogin"));
const Assistant = lazy(() => import("./pages/Assistant"));

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
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="section-ivory min-h-screen flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-emerald-brand animate-spin" />
            </div>
          }>
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
          </Suspense>
        </ErrorBoundary>
      </Layout>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;