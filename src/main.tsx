import React from "react";
import ReactDOM from "react-dom/client";

import { Cleaner, CleanerProvider } from "@/features/cleaner";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { AppLayout } from "@/app/layout/AppLayout";
import { language } from "@/lang";

import "@sito/ui/theme.css";
import "@sito/ui/styles.css";
import "@/styles/index.css";

document.documentElement.lang = language;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <CleanerProvider>
        <AppLayout>
          <Cleaner />
        </AppLayout>
      </CleanerProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
