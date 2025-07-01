
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { JavaScriptFunctionsProvider } from '@/contexts/JavaScriptFunctionsContext';
import { GlobalVariablesProvider } from '@/contexts/GlobalVariablesContext';
import { FlowProvider } from '@/contexts/FlowContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlowProvider>
        <GlobalVariablesProvider>
          <JavaScriptFunctionsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </JavaScriptFunctionsProvider>
        </GlobalVariablesProvider>
      </FlowProvider>
    </QueryClientProvider>
  );
}

export default App;
