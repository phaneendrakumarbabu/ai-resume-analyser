import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import NeuralBackground from "@/components/ui/flow-field-background";
import Index from "./pages/Index";
import Analyzer from "./pages/Analyzer";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import FirebaseTest from "./pages/FirebaseTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="relative min-h-screen bg-background text-foreground">
          <NeuralBackground className="fixed inset-0 pointer-events-none z-0" />
          <div className="relative z-10">
            <BrowserRouter>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/firebase-test" element={<FirebaseTest />} />
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/analyzer" element={<Analyzer />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
