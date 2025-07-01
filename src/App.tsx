
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { GlobalVariablesProvider } from '@/contexts/GlobalVariablesContext';
import { JavaScriptFunctionsProvider } from '@/contexts/JavaScriptFunctionsContext';
import { FlowProvider } from '@/contexts/FlowContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <GlobalVariablesProvider>
      <JavaScriptFunctionsProvider>
        <FlowProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </FlowProvider>
      </JavaScriptFunctionsProvider>
    </GlobalVariablesProvider>
  );
}

export default App;
