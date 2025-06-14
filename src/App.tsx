import * as React from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";

import Home from "./pages/home";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import NotFound from "./pages/not-found";

// (import only what you use directly here)

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="pdf4ever-theme">
      <TooltipProvider>
        <div className="h-screen bg-background text-foreground antialiased">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />

            <Route path="/terms-of-service" component={TermsOfService} />

            <Route component={NotFound} />
          </Switch>
          <footer className="flex justify-end">
            <p className="text-sm text-gray-400">PDF4EVER &copy; 2023</p>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
