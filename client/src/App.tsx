import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "./pages/home-page";
import MoviePage from "./pages/movie-page";
import AuthPage from "./pages/auth-page";
import React, { useEffect } from "react";
import axios from "axios";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/movie/:id" component={MoviePage} />
      <Route path="/auth" component={AuthPage} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/test");
        console.log(response.data);
      } catch (error) {
        console.error("API connection error:", error);
      }
    };

    testApi();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
