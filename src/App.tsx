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
      data-oid="4ra5qxa"
    >
      <TooltipProvider data-oid="meokn8b">
        <div
          className="h-screen bg-background text-foreground antialiased"
          data-oid="tkra:ej"
        >
          <Switch data-oid="j3o5bfm">
            <Route path="/" component={Home} data-oid="ndsf8za" />
            <Route
              path="/privacy-policy"
              component={PrivacyPolicy}
              data-oid="_-h0978"
            />

            <Route
              path="/terms-of-service"
              component={TermsOfService}
              data-oid=":hwou52"
            />

            <Route component={NotFound} data-oid="qu7n3:t" />
          </Switch>
          <footer className="flex justify-end" data-oid="ipztzeg">
            <p className="text-sm text-gray-400" data-oid="1_aia-q">
              PDF4EVER &copy; 2023
            </p>
          </footer>
        </div>
        <Toaster data-oid="x0mp:xo" />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
