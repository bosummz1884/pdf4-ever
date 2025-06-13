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
    <ThemeProvider
      defaultTheme="dark"
      storageKey="pdf4ever-theme"
      data-oid="o7_o2bt"
    >
      <TooltipProvider data-oid="vdy_7gw">
        <div
          className="h-screen bg-background text-foreground antialiased"
          data-oid="0izju_s"
        >
          <Switch data-oid="it4gi7t">
            <Route path="/" component={Home} data-oid="nacsukh" />
            <Route
              path="/privacy-policy"
              component={PrivacyPolicy}
              data-oid="q2.lb01"
            />
            <Route
              path="/terms-of-service"
              component={TermsOfService}
              data-oid="re49o1q"
            />
            <Route component={NotFound} data-oid="3ck8fyh" />
          </Switch>
          <footer className="flex justify-end" data-oid="7skdx3s">
            <p className="text-sm text-gray-400" data-oid="eg2i-y4">
              PDF4EVER &copy; 2023
            </p>
          </footer>
        </div>
        <Toaster data-oid="bbml8s2" />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
