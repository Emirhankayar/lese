"use client";

import { createClient } from "@/lib/sbClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthPage() {
  const supabase = createClient();

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md shadow-xl p-6 rounded-lg border bg-card text-card-foreground">
        <Auth
          supabaseClient={supabase}
          providers={["google"]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "hsl(var(--primary))",         
                  brandAccent: "hsl(var(--primary))",   
                  inputBackground: "hsl(var(--background))",
                  inputText: "hsl(var(--foreground))",
                  inputBorder: "hsl(var(--border))",
                  inputLabelText: "hsl(var(--muted-foreground))",
                  messageText: "hsl(var(--muted-foreground))",
                },
              },
            },
            className: {
              container: "space-y-4", 
              button: "rounded-lg px-4 py-2 text-sm font-medium transition",
              input: "border border-input rounded-md px-3 py-2 bg-background text-foreground",
              label: "text-sm font-medium text-muted-foreground",
            },
          }}
          theme="dark"
        />
      </div>
    </div>
  );
}