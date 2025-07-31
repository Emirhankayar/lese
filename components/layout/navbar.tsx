"use client";
import { Menu } from "lucide-react";
import leseicon from "../icons/g14.svg";
import React, { useEffect, useState } from 'react';
import { createClient } from "@/lib/sbClient";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#about",
    label: "Hakkımızda",
  },
  {
    href: "#services",
    label: "Hizmetlerimiz",
  },
  {
    href: "#contact",
    label: "İletişim",
  },
  {
    href: "/shop",
    label: "Shop",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const supabase = createClient();
    
    async function initializeAuth() {
      try {
        // First, try to refresh the session
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.log("Refresh failed, getting current session:", refreshError.message);
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error("Session error:", error);
          } else {
            console.log("Current session:", session);
            setUser(session?.user ?? null);
          }
        } else {
          console.log("Refreshed session:", refreshedSession);
          setUser(refreshedSession?.user ?? null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
      } else {
        setUser(null);
        setIsOpen(false);
        // Force page refresh to clear any cached state
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
        <Link href="/" className="font-bold text-lg flex items-center">
          <Image src={leseicon} alt="LESE logo" className="ml-2 w-20" />
        </Link>
        <div className="animate-pulse">Loading...</div>
      </header>
    );
  }

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <Image src={leseicon} alt="LESE logo" className="ml-2 w-20" />
      </Link>

      {/* Mobile menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary">
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle>
                  <Link href="/" className="flex items-center">
                    <Image src={leseicon} alt="LESE logo" className="w-20" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button key={href} onClick={() => setIsOpen(false)} asChild variant="ghost" className="justify-start text-base">
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}

                {/* Auth buttons */}
                {user ? (
                  <Button onClick={handleSignOut} variant="ghost" className="justify-start text-base">
                    Sign Out ({user.email})
                  </Button>
                ) : (
                  <Button onClick={() => setIsOpen(false)} asChild variant="ghost" className="justify-start text-base">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
            <SheetFooter className="flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop menu */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}

            {/* Auth buttons desktop */}
            {user ? (
              <Button onClick={handleSignOut} variant="ghost" className="text-base px-2">
                Sign Out
              </Button>
            ) : (
              <NavigationMenuLink asChild>
                <Link href="/auth" className="text-base px-2">
                  Sign In
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:flex">
        <ToggleTheme />
      </div>
    </header>
  );
};