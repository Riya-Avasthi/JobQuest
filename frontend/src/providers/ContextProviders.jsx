import React from "react";
import { GlobalProvider } from "@/context/globalContext";
import { JobsProvider } from "@/context/jobsContext";

export function ContextProviders({ children }) {
  return (
    <GlobalProvider>
      <JobsProvider>
        {children}
      </JobsProvider>
    </GlobalProvider>
  );
}

export default ContextProviders;