
"use client";
import { Menu, Store, ShoppingCart, LogOut, User, Phone, CircleCheckBig, HelpCircle, Circle } from "lucide-react";
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
} from "../ui/sheet"
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: { href: string; label: string; icon?: React.ReactNode }[] = [
  { href: "/#about", label: "Hakkımızda", icon: <HelpCircle className="w-4 h-4" /> },
  { href: "/#services", label: "Hizmetlerimiz", icon: <CircleCheckBig className="w-4 h-4" /> },
  { href: "/#contact", label: "İletişim", icon: <Phone className="w-4 h-4" /> },
  { href: "/shop", label: "Mağaza", icon: <Store className="w-4 h-4" /> },
  { href: "/cart", label: "Sepet", icon: <ShoppingCart className="w-4 h-4" /> },
  { href: "/profile", label: "Profil", icon: <User className="w-4 h-4" /> },
];
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function initializeAuth() {
      try {
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
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

/*
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
 */

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
{user && (
  <div className="px-4 py-4 border-b border-gray-300 text-md">
    {user.email}
  </div>
)}

{routeList.map(({ href, label, icon }) => (
  <Button
    key={href}
    onClick={() => setIsOpen(false)}
    asChild
    variant="ghost"
    className="justify-start text-base flex gap-2"
  >
    <Link href={href} className="flex items-center gap-2 py-8">
      {icon}{label}
    </Link>
  </Button>
))}
                {/* Auth buttons */}
                {user ? (
                  <Button onClick={handleSignOut} variant="ghost" className="text-base justify-start gap-2">
                    <LogOut className="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" /> Çıkış Yap
                  </Button>
                ) : (
                  <Button onClick={() => setIsOpen(false)} asChild variant="outline"
  style={{ backgroundColor: "#3235d1", color: "white", borderColor: "#3235d1" }}
  className="text-base hover:opacity-90 transition">
                    <Link href="/auth">Giriş Yap</Link>
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
    {/* Dropdown group for first 3 items */}
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        Anasayfa 
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="flex flex-col p-2 space-y-1">
          {routeList.slice(0, 3).map(({ href, label, icon }) => (
            <NavigationMenuLink
              key={href}
              asChild
            >
              <Link
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {icon}
                {label}
              </Link>
            </NavigationMenuLink>
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    {/* Individual buttons for remaining items */}
    {routeList.slice(3).map(({ href, label, icon }) => (
      <NavigationMenuItem key={href}>
        <Button
          onClick={() => setIsOpen(false)}
          asChild
          variant="ghost"
          className="justify-start text-base"
        >
          <Link href={href} className="flex items-center gap-2">
            {icon}
            {label}
          </Link>
        </Button>
      </NavigationMenuItem>
    ))}

    {/* Auth buttons */}
    {user ? (
      <NavigationMenuItem>
        <Button onClick={handleSignOut} variant="ghost" className="text-base justify-start">
          <LogOut className="w-4 h-4 text-red-500 hover:text-red-700 transition-colors" />
        </Button>
      </NavigationMenuItem>
    ) : (
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="/auth" className="text-base px-2">
            <Button
              variant="outline"
              style={{ backgroundColor: "#3235d1", color: "white", borderColor: "#3235d1" }}
              className="text-base hover:opacity-90 transition"
            >
              Giriş Yap
            </Button>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )}
  </NavigationMenuList>
</NavigationMenu>



      <div className="hidden lg:flex">
        <ToggleTheme />
      </div>
    </header>
  );
};