import React from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🚀 CI/CD Dashboard
      </h1>
      <Dashboard />
    </div>
  );
}
